'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { Footer } from './footer';
import { useRouter } from 'next/navigation';
import { Header } from './header';
import { Button } from './ui/button';

export interface RefugeePosko {
  no: number;
  nama: string;
  jumlah: string;
}

export interface RefugeeData {
  post: {
    kecamatan: string;
    posko: RefugeePosko[];
  }[];
  total: number;
}

interface RefugeeProps {
  initialData: RefugeeData;
  lastUpdate: any;
}

export function Posko({ initialData, lastUpdate }: RefugeeProps) {
  const [data] = useState<RefugeeData>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [openKecamatan, setOpenKecamatan] = useState<Record<string, boolean>>({});
  const [defaultOpen, setDefaultOpen] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];

  const filteredData = useMemo(() => {
    const s = searchTerm.toLowerCase();

    return data.post
      .map((item) => {
        const poskoFiltered = item.posko.filter(
          (p) =>
            p.nama.toLowerCase().includes(s) ||
            p.no.toString().includes(s) ||
            p.jumlah.toLowerCase().includes(s),
        );

        if (item.kecamatan.toLowerCase().includes(s)) {
          return item;
        }

        return { ...item, posko: poskoFiltered };
      })
      .filter((item) => item.posko.length > 0 || item.kecamatan.toLowerCase().includes(s));
  }, [searchTerm, data]);

  useEffect(() => {
    if (searchTerm === '') {
      setOpenKecamatan(defaultOpen);
      return;
    }

    const allOpen: Record<string, boolean> = {};
    filteredData.forEach((item) => {
      allOpen[item.kecamatan] = true;
    });

    setOpenKecamatan(allOpen);
  }, [searchTerm, filteredData, defaultOpen]);

  const toggleKecamatan = (name: string) => {
    setOpenKecamatan((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    const all: Record<string, boolean> = {};
    data.post.forEach((item) => {
      all[item.kecamatan] = true;
    });

    setDefaultOpen(all);
    setOpenKecamatan(all);
  }, [data]);

  const handleRowClick = (nama: string, jumlah: string) => {
    // Only navigate if jumlah > 0
    if (parseInt(jumlah) > 0) {
      router.push(`/daftar-pengungsi`);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="w-fit gap-2 px-0 text-sm font-medium text-muted-foreground hover:text-foreground"
          aria-label="Kembali ke halaman utama"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke beranda
        </Button>

        <Header
          lastUpdateDate={lastUpdateDate}
          showActions={false}
          title="Daftar Posko Pengungsi"
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari posko / kecamatan / jumlah"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        {filteredData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada data yang sesuai dengan pencarian
          </div>
        )}
        {filteredData.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {filteredData.map((item) => (
                  <div key={item.kecamatan}>
                    {/* Kecamatan Header */}
                    <button
                      onClick={() => toggleKecamatan(item.kecamatan)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 border-b text-left"
                    >
                      <span className="font-bold text-lg">{item.kecamatan}</span>
                      {openKecamatan[item.kecamatan] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>

                    {/* POSKO TABLE */}
                    {openKecamatan[item.kecamatan] && (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="w-16 font-semibold">NO</TableHead>
                            <TableHead className="font-semibold">NAMA POSKO</TableHead>
                            <TableHead className="text-right font-semibold">
                              JUMLAH PENGUNGSI
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {item.posko.map((p, index) => {
                            const isClickable = parseInt(p.jumlah) > 0;

                            return (
                              <TableRow
                                key={index}
                                onClick={() => handleRowClick(p.nama, p.jumlah)}
                                className={
                                  isClickable
                                    ? 'hover:bg-muted/50 cursor-pointer'
                                    : 'opacity-60 cursor-default'
                                }
                              >
                                <TableCell className="font-medium">{p.no}</TableCell>
                                <TableCell className="font-medium">{p.nama}</TableCell>
                                <TableCell className="text-right">{p.jumlah}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                ))}
                <div className="p-4 border-t flex justify-end">
                  <span className="font-bold text-lg">{`Total Pengungsi: ${data.total.toLocaleString()}`}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Footer />
      </div>
    </div>
  );
}
