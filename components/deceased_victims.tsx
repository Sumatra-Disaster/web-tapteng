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
import { Header } from './header';

interface DeceasedVictimsProps {
  initialData: DeceasedData[];
  lastUpdate: any;
}

export function DeceasedVictims({ initialData, lastUpdate }: DeceasedVictimsProps) {
  const [data] = useState<DeceasedData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const router = useRouter();

  const descriptionOptions = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => {
      if (item.kecamatan) {
        unique.add(item.kecamatan.trim());
      }
    });

    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'));
  }, [data]);

  // Filter data based on search term and description
  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return data.filter((item) => {
      const normalizedDescription = (item.kecamatan ?? '').toString().trim().toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(search) ||
        // item.umur.toString().includes(search) ||
        // item.alamat.toString().includes(search) ||
        normalizedDescription.includes(search);

      const matchesDescription =
        descriptionFilter === 'all' || normalizedDescription === descriptionFilter;

      return matchesSearch && matchesDescription;
    });
  }, [data, searchTerm, descriptionFilter]);

  // console.log('filteredData', filteredData.length);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = useMemo(() => {
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize, totalPages]);

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

        <Header
          lastUpdateDate={lastUpdateDate}
          showActions={false}
          title="Daftar Korban Meninggal"
        />

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
                  placeholder="Cari nama, usia, alamat, atau keterangan"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
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
                onChange={(e) => {
                  setDescriptionFilter(e.target.value);
                  setPage(1);
                }}
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
                        <TableHead className="min-w-[100px] font-semibold">Jenis Kelamin</TableHead>
                        <TableHead className="min-w-[200px] font-semibold">Umur</TableHead>
                        <TableHead className="min-w-[220px] font-semibold">Keterangan</TableHead>
                        <TableHead className="min-w-[220px] font-semibold">Alamat</TableHead>
                        <TableHead className="min-w-[220px] font-semibold">Kecamatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((item, index) => (
                        <TableRow key={item.id ?? index} className="text-sm">
                          <TableCell className="font-semibold text-muted-foreground">
                            {(page - 1) * pageSize + index + 1}
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.jenis_kelamin}</TableCell>
                          <TableCell className="whitespace-pre-line text-foreground/80">
                            {item.umur}
                          </TableCell>
                          <TableCell className="whitespace-pre-line text-foreground/80">
                            {item.keterangan}
                          </TableCell>
                          <TableCell className="whitespace-pre-line text-foreground/80">
                            {item.alamat}
                          </TableCell>

                          <TableCell className="whitespace-pre-line text-foreground/80">
                            {item.kecamatan}
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

        {data.length > 0 && filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              Menampilkan {filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
              {Math.min(page * pageSize, filteredData.length)} dari {filteredData.length} entri
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="page-size" className="text-sm">
                  Tampilkan:
                </label>
                <select
                  id="page-size"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-md border border-muted-foreground/20 bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Sebelumnya
                </Button>
                <span>
                  Halaman {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
