'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ArrowLeft } from 'lucide-react';
import { Footer } from './footer';
import { useRouter } from 'next/navigation';
import { Header } from './header';
import { Button } from './ui/button';
import { TitikJalanPutusData } from '@/interfaces/DisasterData';

interface TitikJalanPutusProps {
  initialData: TitikJalanPutusData[];
  lastUpdate: any;
}

export function TitikJalanPutus({ initialData, lastUpdate }: TitikJalanPutusProps) {
  const [data] = useState<TitikJalanPutusData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const search = searchTerm.toLowerCase();
    return data.filter((item) => {
      return (
        item.kecamatan.toLowerCase().includes(search) ||
        item.namaJalan.toLowerCase().includes(search) ||
        item.statusJalan.toLowerCase().includes(search) ||
        item.keterangan.toLowerCase().includes(search) ||
        item.kondisiTerkini.toLowerCase().includes(search) ||
        item.keteranganTambahan.toLowerCase().includes(search) ||
        (item.no !== null && item.no.toString().includes(search)) ||
        (item.noKecamatan !== null && item.noKecamatan.toString().includes(search))
      );
    });
  }, [data, searchTerm]);

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

        <Header lastUpdateDate={lastUpdateDate} showActions={false} title="Titik Jalan Putus" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kecamatan, nama jalan, status jalan, atau keterangan"
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
                <Table>
                  <TableCaption className="px-6 text-left pb-2">
                    Daftar titik jalan putus akibat bencana banjir bandang dan longsor di Kabupaten
                    Tapanuli Tengah.
                  </TableCaption>
                  <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                    <TableRow className="text-xs uppercase tracking-wide">
                      <TableHead className="w-16 font-semibold">NO</TableHead>
                      <TableHead className="min-w-[140px] font-semibold">Kecamatan</TableHead>
                      <TableHead className="min-w-[200px] font-semibold">Nama Jalan</TableHead>
                      <TableHead className="min-w-[140px] font-semibold">Status Jalan</TableHead>
                      <TableHead className="min-w-[200px] font-semibold">Keterangan</TableHead>
                      <TableHead className="min-w-[180px] font-semibold">Kondisi Terkini</TableHead>
                      <TableHead className="min-w-[200px] font-semibold">
                        Keterangan Tambahan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => {
                      return (
                        <TableRow key={item.id} className="text-sm">
                          <TableCell className="text-center">
                            {item.noKecamatan !== null ? item.noKecamatan : '-'}
                          </TableCell>
                          <TableCell className="font-medium">{item.kecamatan || '-'}</TableCell>
                          <TableCell>{item.namaJalan}</TableCell>
                          <TableCell>{item.statusJalan || '-'}</TableCell>
                          <TableCell>{item.keterangan || '-'}</TableCell>
                          <TableCell>{item.kondisiTerkini || '-'}</TableCell>
                          <TableCell>{item.keteranganTambahan || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Footer />
      </div>
    </div>
  );
}
