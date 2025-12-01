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
  TableFooter,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, Search } from 'lucide-react';
import { DisasterData } from '@/interfaces/DisasterData';
import { useRouter } from 'next/navigation';
import { Footer } from './footer';
import { Button } from './ui/button';

interface DisasterDashboardProps {
  initialData: DisasterData[];
  lastUpdate: any;
}

export function DisasterDashboard({ initialData, lastUpdate }: DisasterDashboardProps) {
  const [data] = useState<DisasterData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const search = searchTerm.toLowerCase();
    return data.filter((item) => {
      return (
        item.kecamatan.toLowerCase().includes(search) ||
        (item.no ?? '').toString().includes(search) ||
        item.jumlah_penduduk.toString().includes(search) ||
        item.meninggal.toString().includes(search) ||
        item.luka.toString().includes(search) ||
        item.hilang.toString().includes(search) ||
        item.belum_ter_evakuasi.toString().includes(search)
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
        belum_ter_evakuasi: acc.belum_ter_evakuasi + item.belum_ter_evakuasi,
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
        belum_ter_evakuasi: 0,
        pengungsi: 0,
        terdampak: 0,
        rumah_ringan: 0,
        rumah_sedang: 0,
        rumah_berat: 0,
        sekolah_ringan: 0,
        sekolah_sedang: 0,
        sekolah_berat: 0,
      },
    );
  }, [filteredData]);

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];
  const numberFormatter = useMemo(() => new Intl.NumberFormat('id-ID'), []);
  const formatNumber = (value: number) => numberFormatter.format(value);

  const statCards = [
    {
      label: 'Total Penduduk',
      value: totals.jumlah_penduduk,
      description: 'Warga di kecamatan terdampak',
    },
    {
      label: 'Terdampak',
      value: totals.terdampak,
      description: 'Perkiraan jiwa terdampak',
    },
    {
      label: 'Pengungsi',
      value: totals.pengungsi,
      description: 'Pengungsi di luar Pandan',
    },
    {
      label: 'Korban Meninggal',
      value: totals.meninggal,
      description: 'Lihat daftar korban',
      highlight: true,
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 md:px-6">
      <a
        href="#data-tabel-kecamatan"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:rounded-full focus:bg-background focus:px-4 focus:py-2"
      >
        Lewati ke tabel data kecamatan
      </a>

      <div className="flex flex-col gap-10">
        <header className="flex flex-col items-center gap-6 text-center">
          <img
            src="https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/b5126efa-e9a0-4cfd-9763-be836e0861ed/image/w=640,quality=90,fit=scale-down"
            alt="Logo BPBD Kabupaten Tapanuli Tengah"
            className="h-28 w-auto"
            loading="lazy"
          />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Informasi Resmi BPBD Tapanuli Tengah
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Data Bencana Banjir Bandang dan Longsor
            </h1>
            <p className="text-muted-foreground">
              Update terakhir:{' '}
              <span className="font-semibold">{lastUpdateDate || 'Tanggal tidak tersedia'}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <Button variant="secondary" onClick={() => router.push('/daftar-korban')}>
              Lihat daftar korban meninggal
            </Button>
            <Button variant="destructive" asChild>
              <a href="tel:081290900222" aria-label="Hubungi call center darurat">
                <PhoneCall />
                Hubungi BPBD TapTeng
              </a>
            </Button>
          </div>
        </header>

        {/* Summary Cards */}
        <section
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          aria-live="polite"
        >
          {statCards.map((stat) => {
            const isPengungsi = stat.label === 'Pengungsi';
            const isKorbanMeninggal = stat.highlight;
            const clickable = isPengungsi || isKorbanMeninggal;

            const handleClick = () => {
              if (isKorbanMeninggal) {
                router.push('/daftar-korban');
              } else if (isPengungsi) {
                router.push('/daftar-pengungsi');
              }
            };

            return (
              <Card
                key={stat.label}
                className={
                  stat.highlight
                    ? 'border-destructive/40 bg-destructive/5 shadow-sm hover:cursor-pointer'
                    : isPengungsi
                      ? 'border-yellow-400/40 bg-yellow-400/5 shadow-sm hover:cursor-pointer'
                      : clickable
                        ? 'hover:cursor-pointer'
                        : ''
                }
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onClick={clickable ? handleClick : undefined}
                onKeyDown={
                  clickable
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleClick();
                        }
                      }
                    : undefined
                }
                aria-label={
                  isKorbanMeninggal
                    ? 'Buka daftar korban meninggal'
                    : isPengungsi
                      ? 'Buka daftar pengungsi'
                      : undefined
                }
              >
                <CardHeader className="space-y-1">
                  <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </CardDescription>
                  <CardTitle
                    className={`text-3xl font-bold ${
                      stat.highlight ? 'text-destructive' : isPengungsi ? 'text-yellow-500' : ''
                    }`}
                  >
                    {formatNumber(stat.value)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        {/* Search */}
        <section
          aria-labelledby="search-dashboard"
          className="space-y-2 rounded-2xl border bg-muted/20 p-4 md:p-6"
        >
          <div>
            <p
              id="search-dashboard"
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Cari data kecamatan
            </p>
            <p className="text-sm text-muted-foreground">
              Gunakan kotak pencarian untuk memfilter berdasarkan nama kecamatan atau angka pada
              tabel.
            </p>
          </div>
          <label htmlFor="dashboard-search" className="sr-only">
            Masukkan kata kunci pencarian
          </label>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="dashboard-search"
              placeholder="Cari kecamatan, jumlah korban, atau kata kunci lain"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-full border-muted-foreground/20 bg-background/60 pl-12 text-base"
            />
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Menampilkan {filteredData.length} dari {data.length} kecamatan.
          </p>
        </section>

        {/* Data Table */}
        <section aria-labelledby="data-tabel-kecamatan" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="data-tabel-kecamatan" className="text-xl font-semibold">
              Rincian data kecamatan
            </h2>
            <p className="text-sm text-muted-foreground">
              Geser ke samping untuk melihat seluruh kolom.
            </p>
          </div>
          <Card className="py-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption className="px-6 text-left pb-2">
                    Data ringkas korban dan kerusakan di setiap kecamatan Kabupaten Tapanuli Tengah.
                  </TableCaption>
                  <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                    <TableRow className="text-xs uppercase tracking-wide">
                      <TableHead className="w-16 p-3 font-semibold">No</TableHead>
                      <TableHead className="min-w-[160px] font-semibold">Kecamatan</TableHead>
                      <TableHead className="min-w-[140px] text-right font-semibold">
                        Jumlah Penduduk
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        <abbr title="Korban meninggal dunia">Meninggal</abbr>
                      </TableHead>
                      <TableHead className="text-center font-semibold">Luka</TableHead>
                      <TableHead className="text-center font-semibold">Hilang</TableHead>
                      <TableHead className="text-center font-semibold">
                        <abbr title="Belum Ter-Evakuasi">Belum Ter-Evakuasi</abbr>
                      </TableHead>
                      <TableHead className="text-center font-semibold">Pengungsi</TableHead>
                      <TableHead className="text-center font-semibold">Terdampak</TableHead>
                      <TableHead className="text-center font-semibold" colSpan={3}>
                        Rumah Rusak
                      </TableHead>
                      <TableHead className="text-center font-semibold" colSpan={3}>
                        Sekolah Rusak
                      </TableHead>
                    </TableRow>
                    <TableRow className="bg-muted/40 text-[11px] uppercase tracking-wide">
                      <TableHead colSpan={9}></TableHead>
                      <TableHead className="text-center">Ringan</TableHead>
                      <TableHead className="text-center">Sedang</TableHead>
                      <TableHead className="text-center">Berat</TableHead>
                      <TableHead className="text-center">Ringan</TableHead>
                      <TableHead className="text-center">Sedang</TableHead>
                      <TableHead className="text-center">Berat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id} className="text-sm odd:bg-muted/20">
                        <TableCell className="font-semibold text-muted-foreground">
                          {item.no}
                        </TableCell>
                        <TableCell className="font-medium">{item.kecamatan}</TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.jumlah_penduduk)}
                        </TableCell>
                        <TableCell className="text-center text-destructive font-semibold">
                          {item.meninggal > 0 ? formatNumber(item.meninggal) : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.luka > 0 ? formatNumber(item.luka) : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.hilang > 0 ? formatNumber(item.hilang) : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.belum_ter_evakuasi > 0
                            ? formatNumber(item.belum_ter_evakuasi)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.pengungsi_di_luar_pandan > 0
                            ? formatNumber(item.pengungsi_di_luar_pandan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatNumber(item.terdampak)}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.rumah_rusak_ringan > 0
                            ? formatNumber(item.rumah_rusak_ringan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.rumah_rusak_sedang > 0
                            ? formatNumber(item.rumah_rusak_sedang)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.rumah_rusak_berat > 0 ? formatNumber(item.rumah_rusak_berat) : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.sekolah_rusak_ringan > 0
                            ? formatNumber(item.sekolah_rusak_ringan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.sekolah_rusak_sedang > 0
                            ? formatNumber(item.sekolah_rusak_sedang)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.sekolah_rusak_berat > 0
                            ? formatNumber(item.sekolah_rusak_berat)
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-primary/5 text-sm font-semibold">
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(totals.jumlah_penduduk)}
                      </TableCell>
                      <TableCell className="text-center text-destructive">
                        {formatNumber(totals.meninggal)}
                      </TableCell>
                      <TableCell className="text-center">{formatNumber(totals.luka)}</TableCell>
                      <TableCell className="text-center">{formatNumber(totals.hilang)}</TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.belum_ter_evakuasi)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.pengungsi)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.terdampak)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.rumah_ringan)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.rumah_sedang)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.rumah_berat)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.sekolah_ringan)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.sekolah_sedang)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatNumber(totals.sekolah_berat)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>

          {filteredData.length === 0 && (
            <div
              className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center text-muted-foreground"
              role="status"
            >
              Tidak ada data yang sesuai dengan pencarian. Coba gunakan kata kunci lain.
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}
