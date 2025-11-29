"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import type { DisasterData } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onDataUploaded: (data: DisasterData[]) => void
}

export function UploadDialog({ isOpen, onClose, onDataUploaded }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if it's a CSV file
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a CSV file")
        setFile(null)
      }
    }
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim())

    return lines.slice(1).map((line) => {
      const values = line.split(",")
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = values[index]?.trim() || ""
      })
      return obj
    })
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const text = await file.text()
      const parsedData = parseCSV(text)

      // Map CSV data to database schema
      const formattedData = parsedData.map((row, index) => ({
        no: Number.parseInt(row.NO || row.no || index + 1),
        kecamatan: row.KECAMATAN || row.kecamatan || "",
        jumlah_penduduk: Number.parseInt(row.JUMLAH_PENDUDUK || row.jumlah_penduduk || "0"),
        meninggal: Number.parseInt(row.MENINGGAL || row.meninggal || "0"),
        luka: Number.parseInt(row.LUKA || row.luka || "0"),
        hilang: Number.parseInt(row.HILANG || row.hilang || "0"),
        pengungsi_di_luar_pandan: Number.parseInt(
          row.PENGUNGSI || row.pengungsi || row.PENGUNGSI_DI_LUAR_PANDAN || "0",
        ),
        terdampak: Number.parseInt(row.TERDAMPAK || row.terdampak || "0"),
        rumah_rusak_ringan: Number.parseInt(row.RUMAH_RUSAK_RINGAN || row.rumah_rusak_ringan || "0"),
        rumah_rusak_sedang: Number.parseInt(row.RUMAH_RUSAK_SEDANG || row.rumah_rusak_sedang || "0"),
        rumah_rusak_berat: Number.parseInt(row.RUMAH_RUSAK_BERAT || row.rumah_rusak_berat || "0"),
        sekolah_rusak_ringan: Number.parseInt(row.SEKOLAH_RUSAK_RINGAN || row.sekolah_rusak_ringan || "0"),
        sekolah_rusak_sedang: Number.parseInt(row.SEKOLAH_RUSAK_SEDANG || row.sekolah_rusak_sedang || "0"),
        sekolah_rusak_berat: Number.parseInt(row.SEKOLAH_RUSAK_BERAT || row.sekolah_rusak_berat || "0"),
      }))

      // Insert into Supabase
      const supabase = createClient()
      const { data, error: uploadError } = await supabase.from("disaster_data").insert(formattedData).select()

      if (uploadError) throw uploadError

      // Fetch all data to refresh the view
      const { data: allData, error: fetchError } = await supabase
        .from("disaster_data")
        .select("*")
        .order("no", { ascending: true })

      if (fetchError) throw fetchError

      onDataUploaded(allData || [])
      setFile(null)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Spreadsheet</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing disaster data with the same structure as the table
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">CSV File</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => document.getElementById("file")?.click()}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {file ? file.name : "Choose CSV file"}
              </Button>
              <input id="file" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
            <p className="font-semibold">Expected CSV columns:</p>
            <p className="text-muted-foreground text-xs">
              NO, KECAMATAN, JUMLAH_PENDUDUK, MENINGGAL, LUKA, HILANG, PENGUNGSI, TERDAMPAK, RUMAH_RUSAK_RINGAN,
              RUMAH_RUSAK_SEDANG, RUMAH_RUSAK_BERAT, SEKOLAH_RUSAK_RINGAN, SEKOLAH_RUSAK_SEDANG, SEKOLAH_RUSAK_BERAT
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
