'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { Search, AlertTriangle, ArrowLeft } from 'lucide-react';
import { DeceasedData } from '@/interfaces/DisasterData';
import { Footer } from './footer';
import { Button } from './ui/button';

interface DeceasedVictimsProps {
  initialData: DeceasedData[];
  lastUpdate: any;
}

export function DeceasedVictims({ initialData, lastUpdate }: DeceasedVictimsProps) {
  const [data] = useState<DeceasedData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('all');
  const router = useRouter();

  const descriptionOptions = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => {
      if (item.description) {
        unique.add(item.description.trim());
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'));
  }, [data]);

  // Filter data based on search term and description
  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return data.filter((item) => {
      const normalizedDescription = (item.description ?? '').toString().trim().toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(search) ||
        (item.no ?? '').toString().includes(search) ||
        item.umur.toString().includes(search) ||
        item.alamat.toString().includes(search) ||
        normalizedDescription.includes(search);

      const matchesDescription =
        descriptionFilter === 'all' || normalizedDescription === descriptionFilter;

      return matchesSearch && matchesDescription;
    });
  }, [data, searchTerm, descriptionFilter]);

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];

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

        <header className="flex flex-col items-center gap-6 text-center">
          <img
            src="/logo-tapteng.png"
            alt="Logo BPBD Kabupaten Tapanuli Tengah"
            className="h-28 w-auto"
            loading="lazy"
          />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Informasi Resmi BPBD Tapanuli Tengah
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Daftar Korban Meninggal</h1>
            <p className="text-muted-foreground">
              Update terakhir:{' '}
              <span className="font-semibold">{lastUpdateDate || 'Tanggal tidak tersedia'}</span>
            </p>
          </div>
        </header>

        {/* Search */}
        <section
          aria-labelledby="search-title"
          className="space-y-4 rounded-2xl border bg-muted/20 p-4 md:p-6"
        >
          <div className="flex flex-col gap-1">
            <p
              id="search-title"
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Cari data
            </p>
            <p className="text-sm text-muted-foreground">
              Gunakan kolom pencarian atau filter keterangan untuk mempersempit daftar.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="victims-search" className="sr-only">
                Masukkan kata kunci pencarian
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="victims-search"
                  placeholder="Cari nama, nomor urut, usia, alamat, atau keterangan"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 rounded-full border-muted-foreground/20 bg-background/60 pl-12 text-base"
                />
              </div>
            </div>
            <div>
              {/*<label
                htmlFor="description-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                Filter berdasarkan keterangan
              </label>*/}
              <select
                id="description-filter"
                value={descriptionFilter}
                onChange={(e) => setDescriptionFilter(e.target.value)}
                className="w-full rounded-full border border-muted-foreground/20 bg-background/60 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Semua keterangan</option>
                {descriptionOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Menampilkan {filteredData.length} dari {data.length} entri.
          </p>
        </section>

        {/* Data Table */}
        <section aria-live="polite" className="space-y-3">
          <Card className="py-0">
            <CardContent className="p-0">
              {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                  <AlertTriangle className="h-8 w-8" aria-hidden />
                  <p className="font-semibold">Data korban belum tersedia.</p>
                  <p className="text-sm">Mohon periksa kembali nanti.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-t-2xl">
                  <Table>
                    <TableCaption className="px-6 text-center pb-2">
                      Tabel korban meninggal akibat bencana Kabupaten Tapanuli Tengah.
                    </TableCaption>
                    <TableHeader className="bg-muted/40 text-xs uppercase tracking-wide">
                      <TableRow>
                        <TableHead className="w-20 py-4 font-semibold">No</TableHead>
                        <TableHead className="min-w-[180px] font-semibold">Nama</TableHead>
                        <TableHead className="min-w-[100px] font-semibold">Umur</TableHead>
                        <TableHead className="min-w-[200px] font-semibold">Alamat</TableHead>
                        <TableHead className="min-w-[220px] font-semibold">Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item, index) => (
                        <TableRow key={item.id ?? index} className="text-sm">
                          <TableCell className="font-semibold text-muted-foreground">
                            {item.no}
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.umur}</TableCell>
                          <TableCell className="whitespace-pre-line text-foreground/80">
                            {item.alamat}
                          </TableCell>
                          <TableCell className="whitespace-pre-line text-foreground/80">
                            {item.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {data.length > 0 && filteredData.length === 0 && (
            <div
              className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center text-muted-foreground"
              role="status"
            >
              Tidak ada data yang sesuai dengan pencarian.
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}
