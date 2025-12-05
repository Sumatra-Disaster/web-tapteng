'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Search, ArrowLeft } from 'lucide-react';
import { EvacueeData } from '@/interfaces/DisasterData';
import { Footer } from './footer';
import { Button } from '@/components/ui/button';
import { Header } from './header';

interface EvacueesProps {
  initialData: EvacueeData[];
  lastUpdate: any;
}

export function Evacuees({ initialData, lastUpdate }: EvacueesProps) {
  const [data] = useState<EvacueeData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const router = useRouter();

  const locationOptions = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => {
      if (item.location) {
        unique.add(item.location.trim());
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'));
  }, [data]);

  // Filter data based on search term and location
  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return data.filter((item) => {
      const name = (item.name ?? '').toLowerCase();
      const location = (item.location ?? '').toLowerCase();

      const matchesSearch = !searchTerm || name.includes(search) || location.includes(search);

      const matchesLocation =
        locationFilter === 'all' || location.toLowerCase() === locationFilter.toLowerCase();

      return matchesSearch && matchesLocation;
    });
  }, [data, searchTerm, locationFilter]);

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

        <Header lastUpdateDate={lastUpdateDate} showActions={false} title="Daftar Pengungsi" />

        {/* Search */}
        <section
          aria-labelledby="search-evacuees-title"
          className="space-y-4 rounded-2xl border bg-muted/20 p-4 md:p-6"
        >
          <div className="flex flex-col gap-1">
            <p
              id="search-evacuees-title"
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Cari data
            </p>
            <p className="text-sm text-muted-foreground">
              Gunakan kolom pencarian atau filter lokasi untuk mempersempit daftar.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="evacuees-search" className="sr-only">
                Masukkan kata kunci pencarian
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="evacuees-search"
                  placeholder="Cari nama atau lokasi pengungsian"
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
              <select
                id="location-filter"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-full border border-muted-foreground/20 bg-background/60 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Semua lokasi</option>
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Menampilkan {filteredData.length} dari {data.length} pengungsi.
          </p>
        </section>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16 font-semibold">NO</TableHead>
                    <TableHead className="min-w-[200px] font-semibold">NAMA</TableHead>
                    <TableHead className="min-w-[200px] font-semibold">LOKASI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-medium">{item.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            Menampilkan {filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, filteredData.length)} dari {filteredData.length} pengungsi
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
