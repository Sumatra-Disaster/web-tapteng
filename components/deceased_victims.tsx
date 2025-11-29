"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Search, AlertTriangle } from "lucide-react";
import { DeceasedData } from "@/interfaces/DisasterData";
import { useRouter } from "next/navigation";
import { Footer } from "./footer";

interface DeceasedVictimsProps {
  initialData: DeceasedData[];
  lastUpdate: any;
}

export function DeceasedVictims({
  initialData,
  lastUpdate,
}: DeceasedVictimsProps) {
  const [data] = useState<DeceasedData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const search = searchTerm.toLowerCase();
    return data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search) ||
        (item.no ?? "").toString().includes(search) ||
        item.umur.toString().includes(search) ||
        item.alamat.toString().includes(search) ||
        item.description.toString().includes(search)
      );
    });
  }, [data, searchTerm]);

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-center items-center">
          <img
            src="https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/b5126efa-e9a0-4cfd-9763-be836e0861ed/image/w=640,quality=90,fit=scale-down"
            alt="Logo"
            className="h-42 mb-12"
          />
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Daftar Korban Meninggal
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Update Terakhir : {lastUpdateDate || "Tanggal tidak tersedia"}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16 font-semibold">NO</TableHead>
                    <TableHead className="min-w-[150px] font-semibold">
                      NAMA
                    </TableHead>
                    <TableHead className="text-right font-semibold min-w-[120px]">
                      UMUR
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      ALAMAT
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      KETERANGAN
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.no}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.umur}</TableCell>
                      <TableCell className="text-right">
                        {item.alamat}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Footer />

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada data yang sesuai dengan pencarian
          </div>
        )}
      </div>
    </div>
  );
}
