'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, ArrowRight } from 'lucide-react';
import { DisasterData } from '@/interfaces/DisasterData';
import { useRouter } from 'next/navigation';
import { Footer } from './footer';
import { Header } from './header';
import { getRefreshInterval, getStaleThreshold, shouldRefreshOnVisibility } from '@/lib/config';

interface DisasterDashboardProps {
  initialData: DisasterData[];
  lastUpdate: any;
  totalPosko: number;
  totalHelipadLocations: number;
}

export function DisasterDashboard({
  initialData,
  lastUpdate,
  totalPosko,
  totalHelipadLocations,
}: DisasterDashboardProps) {
  const [data, setData] = useState<DisasterData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentLastUpdate, setCurrentLastUpdate] = useState<any>(lastUpdate);
  const [currentTotalPosko, setCurrentTotalPosko] = useState<number>(totalPosko);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  const router = useRouter();

  // Refresh function
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Add timestamp to URL to bypass any caching
      const timestamp = Date.now();
      const response = await fetch(`/api/data?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        // Always update lastUpdate, even if it's the same, to ensure UI reflects latest state
        setCurrentLastUpdate(result.lastUpdate);
        setCurrentTotalPosko(result.totalPosko || totalPosko);
        setLastRefreshTime(Date.now());
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      // Silently fail - keep using existing data
    } finally {
      setIsRefreshing(false);
    }
  }, [totalPosko]);

  // Auto-refresh logic with configurable interval
  useEffect(() => {
    // Get refresh interval from config (can be overridden via environment variable)
    const REFRESH_INTERVAL = getRefreshInterval();
    const STALE_THRESHOLD = getStaleThreshold();
    const REFRESH_ON_VISIBILITY = shouldRefreshOnVisibility();

    // Check if data is stale on mount and refresh immediately if needed
    const checkStaleOnMount = () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime;
      if (timeSinceLastRefresh > STALE_THRESHOLD) {
        refreshData();
      }
    };

    // Initial stale check
    checkStaleOnMount();

    // Set up periodic refresh
    const interval = setInterval(() => {
      refreshData();
    }, REFRESH_INTERVAL);

    // Refresh when user returns to tab (visibility API) - if enabled
    const handleVisibilityChange = () => {
      if (REFRESH_ON_VISIBILITY && document.visibilityState === 'visible') {
        // Check if data is stale (older than stale threshold)
        const timeSinceLastRefresh = Date.now() - lastRefreshTime;
        if (timeSinceLastRefresh > STALE_THRESHOLD) {
          refreshData();
        }
      }
    };

    if (REFRESH_ON_VISIBILITY) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      clearInterval(interval);
      if (REFRESH_ON_VISIBILITY) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [refreshData, lastRefreshTime]);

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
  const persentaseTerdampak = useMemo(() => {
    return (totals.terdampak / totals.jumlah_penduduk) * 100;
  }, [totals.terdampak, totals.jumlah_penduduk]);

  // Extract last update date - ensure it's reactive to currentLastUpdate changes
  const lastUpdateDate = useMemo(() => {
    if (!currentLastUpdate || !Array.isArray(currentLastUpdate) || currentLastUpdate.length === 0) {
      return null;
    }
    const firstRow = currentLastUpdate[0];
    if (!Array.isArray(firstRow) || firstRow.length < 2) {
      return null;
    }
    return firstRow[1] || null;
  }, [currentLastUpdate]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat('id-ID'), []);
  const formatNumber = (value: number) => numberFormatter.format(value);

  const statCards = [
    {
      label: 'Warga Mengungsi',
      value: totals.pengungsi,
      description: 'Lihat Data',
      navigateTo: '/daftar-pengungsi',
      highlight: 'yellow',
    },
    {
      label: 'Korban Meninggal',
      value: totals.meninggal,
      description: 'Lihat Data',
      navigateTo: '/daftar-korban',
      highlight: 'red',
    },
    {
      label: 'Posko Pengungsian',
      value: currentTotalPosko || 0,
      description: 'Lihat Data',
      navigateTo: '/posko',
      highlight: 'green',
    },
    {
      label: 'Titik Lokasi Helipad',
      value: totalHelipadLocations || 0,
      description: 'Lihat Data',
      navigateTo: '/titik-lokasi-helipad',
      highlight: 'blue',
    },
    // {
    //   label: 'Total Penduduk',
    //   value: totals.jumlah_penduduk,
    //   description: 'Warga di kecamatan terdampak',
    // },
    // {
    //   label: 'Terdampak',
    //   value: totals.terdampak,
    //   description: 'Perkiraan jiwa terdampak',
    // },
  ];

  const getCardStyle = (stat: any) => {
    if (stat.highlight === 'red') return 'border-destructive/40 bg-destructive/5 shadow-sm';

    if (stat.highlight === 'yellow') return 'border-yellow-400/40 bg-yellow-400/5 shadow-sm';

    if (stat.highlight === 'green') return 'border-green-400/40 bg-green-400/5 shadow-sm';

    if (stat.highlight === 'blue') return 'border-blue-400/40 bg-blue-400/5 shadow-sm';

    return '';
  };

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 md:px-6">
      <a
        href="#data-tabel-kecamatan"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:rounded-full focus:bg-background focus:px-4 focus:py-2"
      >
        Lewati ke tabel data kecamatan
      </a>

      <div className="flex flex-col gap-10">
        <Header
          lastUpdateDate={lastUpdateDate}
          showActions={false}
          title="Data Bencana Banjir Bandang dan Longsor"
        />

        {/* Refresh Button */}
        <div className="flex justify-end">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            aria-label="Refresh data"
            title="Perbarui data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only md:not-sr-only">
              {isRefreshing ? 'Memperbarui...' : 'Refresh Data'}
            </span>
          </button>
        </div>

        {/* Summary Statistics */}
        <section className="mb-6">
          <Card className="">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-center">Warga Terdampak</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary md:text-5xl">
                    {persentaseTerdampak.toFixed(1)}%
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground md:text-base">
                  <span className="font-semibold text-foreground">
                    {formatNumber(totals.terdampak)} dari {formatNumber(totals.jumlah_penduduk)}{' '}
                    warga terdampak
                  </span>
                  {/* <span>dari <span className="font-semibold text-foreground">{formatNumber(totals.jumlah_penduduk)}</span> warga terdampak</span> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary Cards */}
        <section
          className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4"
          aria-live="polite"
        >
          {statCards.map((stat) => {
            return (
              <Card key={stat.label} className={`${getCardStyle(stat)} text-center`}>
                <CardHeader className="space-y-1">
                  <CardDescription className="text-sm font-semibold text-black">
                    {stat.label}
                  </CardDescription>

                  <CardTitle
                    className={`text-3xl font-bold
                      ${stat.highlight === 'red' ? 'text-destructive' : ''}
                      ${stat.highlight === 'yellow' ? 'text-yellow-500' : ''}
                      ${stat.highlight === 'blue' ? 'text-blue-500' : ''}
                    `}
                  >
                    {formatNumber(stat.value)}
                  </CardTitle>

                  {!stat.navigateTo && stat.description && (
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  )}
                </CardHeader>

                {stat.navigateTo && stat.description && (
                  <CardFooter className="pt-0">
                    <Button
                      variant="blue"
                      size="default"
                      className="w-full justify-between text-sm font-medium transition-colors"
                      onClick={() => router.push(stat.navigateTo!)}
                      aria-label={stat.description}
                    >
                      <span>{stat.description}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </section>

        {/* Search */}
        <section
          aria-labelledby="search-dashboard"
          className="space-y-2 rounded-2xl border bg-muted/20 p-4 md:p-6 hidden"
        >
          <div>
            {/* <p
              id="search-dashboard"
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Cari data kecamatan
            </p> */}
            {/* <p className="text-sm text-muted-foreground">
              Gunakan kotak pencarian untuk memfilter berdasarkan nama kecamatan atau angka pada
              tabel.
            </p> */}
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
          {/* <p className="text-sm text-muted-foreground" aria-live="polite">
            Menampilkan {filteredData.length} dari {data.length} kecamatan.
          </p> */}
        </section>

        {/* Data Table */}
        <section aria-labelledby="data-tabel-kecamatan" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="data-tabel-kecamatan" className="text-xl font-semibold">
              Data Rincian per Kecamatan
            </h2>
            <p className="text-sm text-muted-foreground">
              Geser ke samping untuk melihat seluruh kolom.
            </p>
          </div>
          <Card className="py-0 rounded-none">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption className="px-6 text-left pb-2">
                    Data ringkas korban dan kerusakan di setiap kecamatan Kabupaten Tapanuli Tengah.
                  </TableCaption>
                  <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                    <TableRow className="text-xs uppercase tracking-wide">
                      <TableHead className="sticky left-0 z-40 w-[64px] p-3 font-semibold bg-background border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                        No
                      </TableHead>
                      <TableHead className="sticky left-[64px] z-40 min-w-[160px] p-3 font-semibold bg-background border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                        Kecamatan
                      </TableHead>
                      <TableHead className="min-w-[180px] text-right font-semibold whitespace-nowrap relative z-0">
                        Jumlah Penduduk
                      </TableHead>
                      <TableHead className="text-center font-semibold relative z-0">
                        <abbr title="Korban meninggal dunia">Meninggal</abbr>
                      </TableHead>
                      <TableHead className="text-center font-semibold relative z-0">Luka</TableHead>
                      <TableHead className="text-center font-semibold relative z-0">
                        Hilang
                      </TableHead>
                      <TableHead className="text-center font-semibold relative z-0">
                        <abbr title="Belum Ter-Evakuasi">Belum Ter-Evakuasi</abbr>
                      </TableHead>
                      <TableHead className="text-center font-semibold relative z-0">
                        Pengungsi
                      </TableHead>
                      <TableHead className="text-center font-semibold relative z-0">
                        Terdampak
                      </TableHead>
                      <TableHead className="text-center font-semibold relative z-0" colSpan={3}>
                        Rumah Rusak
                      </TableHead>
                      <TableHead className="text-center font-semibold relative z-0" colSpan={3}>
                        Sekolah Rusak
                      </TableHead>
                    </TableRow>
                    <TableRow className="bg-muted/40 text-[11px] uppercase tracking-wide">
                      <TableHead className="sticky left-0 z-40 w-[64px] p-3 bg-muted/40 border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]"></TableHead>
                      <TableHead className="sticky left-[64px] z-40 p-3 bg-muted/40 border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]"></TableHead>
                      <TableHead colSpan={7}></TableHead>
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
                        <TableCell className="sticky left-0 z-140 w-[64px] font-semibold text-muted-foreground bg-background odd:bg-gray-100 p-3 border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                          {item.no}
                        </TableCell>
                        <TableCell className="sticky left-[54px] z-140 font-medium bg-background odd:bg-muted/20 p-3 border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                          {item.kecamatan}
                        </TableCell>
                        <TableCell className="text-right relative z-0">
                          {formatNumber(item.jumlah_penduduk)}
                        </TableCell>
                        <TableCell className="text-center text-destructive font-semibold relative z-0">
                          {item.meninggal > 0 ? formatNumber(item.meninggal) : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.luka > 0 ? formatNumber(item.luka) : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.hilang > 0 ? formatNumber(item.hilang) : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.belum_ter_evakuasi > 0
                            ? formatNumber(item.belum_ter_evakuasi)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.pengungsi_di_luar_pandan > 0
                            ? formatNumber(item.pengungsi_di_luar_pandan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {formatNumber(item.terdampak)}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.rumah_rusak_ringan > 0
                            ? formatNumber(item.rumah_rusak_ringan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.rumah_rusak_sedang > 0
                            ? formatNumber(item.rumah_rusak_sedang)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.rumah_rusak_berat > 0 ? formatNumber(item.rumah_rusak_berat) : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.sekolah_rusak_ringan > 0
                            ? formatNumber(item.sekolah_rusak_ringan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.sekolah_rusak_sedang > 0
                            ? formatNumber(item.sekolah_rusak_sedang)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center relative z-0">
                          {item.sekolah_rusak_berat > 0
                            ? formatNumber(item.sekolah_rusak_berat)
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-primary/5 text-sm font-semibold">
                    <TableRow>
                      <TableCell className="sticky left-0 z-140 w-[64px] bg-primary/5 p-3 border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                        Total
                      </TableCell>
                      <TableCell className="sticky left-[64px] z-140 bg-primary/5 p-3 border-r border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]"></TableCell>
                      <TableCell className="text-right relative z-0">
                        {formatNumber(totals.jumlah_penduduk)}
                      </TableCell>
                      <TableCell className="text-center text-destructive relative z-0">
                        {formatNumber(totals.meninggal)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.luka)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.hilang)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.belum_ter_evakuasi)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.pengungsi)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.terdampak)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.rumah_ringan)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.rumah_sedang)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.rumah_berat)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.sekolah_ringan)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
                        {formatNumber(totals.sekolah_sedang)}
                      </TableCell>
                      <TableCell className="text-center relative z-0">
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
