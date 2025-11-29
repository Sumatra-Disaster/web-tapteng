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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, AlertTriangle, ArrowRight } from "lucide-react";
import { DisasterData } from "@/interfaces/DisasterData";
import { useRouter } from "next/navigation";
import { Footer } from "./footer";

interface DisasterDashboardProps {
  initialData: DisasterData[];
  lastUpdate: any;
}

export function DisasterDashboard({
  initialData,
  lastUpdate,
}: DisasterDashboardProps) {
  const [data] = useState<DisasterData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const search = searchTerm.toLowerCase();
    return data.filter((item) => {
      return (
        item.kecamatan.toLowerCase().includes(search) ||
        (item.no ?? "").toString().includes(search) ||
        item.jumlah_penduduk.toString().includes(search) ||
        item.meninggal.toString().includes(search) ||
        item.luka.toString().includes(search) ||
        item.hilang.toString().includes(search)
      );
    });
  }, [data, searchTerm]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        jumlah_penduduk: acc.jumlah_penduduk + item.jumlah_penduduk,
        meninggal: acc.meninggal + item.meninggal,
        luka: acc.luka + item.luka,
        hilang: acc.hilang + item.hilang,
        pengungsi: acc.pengungsi + item.pengungsi_di_luar_pandan,
        terdampak: acc.terdampak + item.terdampak,
        rumah_ringan: acc.rumah_ringan + item.rumah_rusak_ringan,
        rumah_sedang: acc.rumah_sedang + item.rumah_rusak_sedang,
        rumah_berat: acc.rumah_berat + item.rumah_rusak_berat,
        sekolah_ringan: acc.sekolah_ringan + item.sekolah_rusak_ringan,
        sekolah_sedang: acc.sekolah_sedang + item.sekolah_rusak_sedang,
        sekolah_berat: acc.sekolah_berat + item.sekolah_rusak_berat,
      }),
      {
        jumlah_penduduk: 0,
        meninggal: 0,
        luka: 0,
        hilang: 0,
        pengungsi: 0,
        terdampak: 0,
        rumah_ringan: 0,
        rumah_sedang: 0,
        rumah_berat: 0,
        sekolah_ringan: 0,
        sekolah_sedang: 0,
        sekolah_berat: 0,
      }
    );
  }, [filteredData]);

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
                Data Bencana Banjir Bandang dan Longsor
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Update Terakhir : {lastUpdateDate || "Tanggal tidak tersedia"}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">
                Total Penduduk
              </CardDescription>
              <CardTitle className="text-2xl md:text-3xl">
                {totals.jumlah_penduduk.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer hover:bg-destructive/10 transition-colors"
            onClick={() => router.push("/daftar-korban")}
          >
            <CardHeader className="pb-2 relative">
              <CardDescription className="text-xs flex items-center justify-between">
                Meninggal
              </CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-destructive">
                {totals.meninggal}
              </CardTitle>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ArrowRight className="h-8 w-8 text-destructive" />
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Terdampak</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">
                {totals.terdampak.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Pengungsi</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">
                {totals.pengungsi.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan kecamatan, jumlah korban, atau data lainnya..."
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
                      KECAMATAN
                    </TableHead>
                    <TableHead className="text-right font-semibold min-w-[120px]">
                      JUMLAH PENDUDUK
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      MENINGGAL
                      <br />
                      <span className="text-xs font-normal text-muted-foreground">
                        (JIWA)
                      </span>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      LUKA
                      <br />
                      <span className="text-xs font-normal text-muted-foreground">
                        (JIWA)
                      </span>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      HILANG
                      <br />
                      <span className="text-xs font-normal text-muted-foreground">
                        (JIWA)
                      </span>
                    </TableHead>
                    <TableHead className="text-right font-semibold min-w-[120px]">
                      PENGUNGSI
                      <br />
                      <span className="text-xs font-normal text-muted-foreground">
                        (JIWA)
                      </span>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      TERDAMPAK
                      <br />
                      <span className="text-xs font-normal text-muted-foreground">
                        (JIWA)
                      </span>
                    </TableHead>
                    <TableHead
                      className="text-center font-semibold"
                      colSpan={3}
                    >
                      RUMAH RUSAK
                    </TableHead>
                    <TableHead
                      className="text-center font-semibold"
                      colSpan={3}
                    >
                      SEKOLAH RUSAK
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableHead colSpan={8}></TableHead>
                    <TableHead className="text-center text-xs">
                      RINGAN
                    </TableHead>
                    <TableHead className="text-center text-xs">
                      SEDANG
                    </TableHead>
                    <TableHead className="text-center text-xs">BERAT</TableHead>
                    <TableHead className="text-center text-xs">
                      RINGAN
                    </TableHead>
                    <TableHead className="text-center text-xs">
                      SEDANG
                    </TableHead>
                    <TableHead className="text-center text-xs">BERAT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.no}</TableCell>
                      <TableCell className="font-medium">
                        {item.kecamatan}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.jumlah_penduduk.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.meninggal > 0 ? (
                          <span className="font-semibold text-destructive">
                            {item.meninggal}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.luka > 0 ? item.luka : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.hilang > 0 ? item.hilang : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.pengungsi_di_luar_pandan > 0
                          ? item.pengungsi_di_luar_pandan.toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.terdampak.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.rumah_rusak_ringan > 0
                          ? item.rumah_rusak_ringan
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.rumah_rusak_sedang > 0
                          ? item.rumah_rusak_sedang
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.rumah_rusak_berat > 0
                          ? item.rumah_rusak_berat
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.sekolah_rusak_ringan > 0
                          ? item.sekolah_rusak_ringan
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.sekolah_rusak_sedang > 0
                          ? item.sekolah_rusak_sedang
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.sekolah_rusak_berat > 0
                          ? item.sekolah_rusak_berat
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-primary/5 font-semibold border-t-2">
                    <TableCell colSpan={2}>TOTAL</TableCell>
                    <TableCell className="text-right">
                      {totals.jumlah_penduduk.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      {totals.meninggal}
                    </TableCell>
                    <TableCell className="text-right">{totals.luka}</TableCell>
                    <TableCell className="text-right">
                      {totals.hilang}
                    </TableCell>
                    <TableCell className="text-right">
                      {totals.pengungsi.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {totals.terdampak.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {totals.rumah_ringan}
                    </TableCell>
                    <TableCell className="text-center">
                      {totals.rumah_sedang}
                    </TableCell>
                    <TableCell className="text-center">
                      {totals.rumah_berat}
                    </TableCell>
                    <TableCell className="text-center">
                      {totals.sekolah_ringan}
                    </TableCell>
                    <TableCell className="text-center">
                      {totals.sekolah_sedang}
                    </TableCell>
                    <TableCell className="text-center">
                      {totals.sekolah_berat}
                    </TableCell>
                  </TableRow>
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
