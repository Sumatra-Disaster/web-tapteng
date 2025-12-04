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
      const response = await fetch('/api/data', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
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
  const lastUpdateDate = currentLastUpdate && currentLastUpdate[0] && currentLastUpdate[0][1];
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl py-8 px-4 md:px-6 lg:px-8">
        <a
          href="#data-tabel-kecamatan"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-background focus:px-6 focus:py-3 focus:shadow-lg"
        >
          Lewati ke tabel data kecamatan
        </a>

        <div className="flex flex-col gap-6 md:gap-8">
          <Header
            lastUpdateDate={lastUpdateDate}
            showActions={false}
            title="Data Bencana Banjir Bandang dan Longsor"
          />

          {/* Hero Section - Summary Statistics */}
          <section className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-[2px]">
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-6">
                <div className="flex flex-col gap-3 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-800 w-fit mx-auto">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-widest">
                      Live Update
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Persentase Warga Terdampak
                  </p>
                  <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    {persentaseTerdampak.toFixed(1)}%
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm md:text-base">
                    <span className="font-black text-foreground">
                      {formatNumber(totals.terdampak)}
                    </span>
                    <span className="text-muted-foreground">dari</span>
                    <span className="font-black text-foreground">
                      {formatNumber(totals.jumlah_penduduk)}
                    </span>
                    <span className="text-muted-foreground">warga terdampak</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats Cards */}
          <section className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground">Statistik Utama</h2>
                <p className="text-sm text-muted-foreground mt-1">Data terkini bencana</p>
              </div>
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 md:px-5 py-2.5 text-xs md:text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Refresh data"
                title="Perbarui data"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Memperbarui...' : 'Refresh'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5" aria-live="polite">
              {statCards.map((stat) => {
                const colorClasses = {
                  red: 'from-red-500 to-rose-600',
                  yellow: 'from-amber-500 to-orange-600',
                  green: 'from-emerald-500 to-teal-600',
                  blue: 'from-blue-500 to-indigo-600',
                };
                return (
                  <div key={stat.label} className="group relative">
                    <Card className="relative border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 py-2 md:py-0">
                      <CardHeader className="space-y-2 md:space-y-4 p-3 md:p-6 pb-2 md:pb-3">
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {stat.label}
                        </CardDescription>
                        <CardTitle
                          className={`text-3xl md:text-5xl font-black bg-gradient-to-r ${colorClasses[stat.highlight as keyof typeof colorClasses]} bg-clip-text text-transparent`}
                        >
                          {formatNumber(stat.value)}
                        </CardTitle>
                      </CardHeader>
                      {stat.navigateTo && stat.description && (
                        <CardFooter className="pt-0 pb-3 md:pb-5 px-3 md:px-6">
                          <button
                            onClick={() => router.push(stat.navigateTo!)}
                            className={`w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r ${colorClasses[stat.highlight as keyof typeof colorClasses]} text-white font-bold text-xs md:text-sm transition-all hover:shadow-lg group-hover:gap-3`}
                            aria-label={stat.description}
                          >
                            <span>{stat.description}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>
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
          <section aria-labelledby="data-tabel-kecamatan" className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2
                  id="data-tabel-kecamatan"
                  className="text-2xl md:text-3xl font-black text-foreground"
                >
                  Data Rincian per Kecamatan
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Informasi lengkap setiap wilayah
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800">
                <span className="text-base">💡</span>
                <span className="font-medium">Geser ke samping untuk melihat seluruh kolom</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-950">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-slate-50 dark:bg-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <TableHead className="sticky left-0 z-40 w-[45px] py-3 px-3 font-bold bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        No
                      </TableHead>
                      <TableHead className="sticky left-[45px] z-40 min-w-[140px] py-3 px-3 font-bold bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        Kecamatan
                      </TableHead>
                      <TableHead className="min-w-[120px] text-right font-bold py-3 px-3 text-slate-700 dark:text-slate-300">
                        Penduduk
                      </TableHead>
                      <TableHead className="text-center font-bold py-3 px-3 text-slate-700 dark:text-slate-300">
                        Meninggal
                      </TableHead>
                      <TableHead className="text-center font-bold py-3 px-3 text-slate-700 dark:text-slate-300">
                        Luka
                      </TableHead>
                      <TableHead className="text-center font-bold py-3 px-3 text-slate-700 dark:text-slate-300">
                        Hilang
                      </TableHead>
                      <TableHead className="text-center font-bold py-3 px-3 text-slate-700 dark:text-slate-300">
                        Belum Evakuasi
                      </TableHead>
                      <TableHead className="text-center font-bold py-3 px-3 text-slate-700 dark:text-slate-300">
                        Pengungsi
                      </TableHead>
                      <TableHead className="text-center font-bold py-3 px-3 text-slate-700 dark:text-slate-300">
                        Terdampak
                      </TableHead>
                      <TableHead
                        className="text-center font-bold py-3 px-3 border-l border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        colSpan={3}
                      >
                        Rumah Rusak
                      </TableHead>
                      <TableHead
                        className="text-center font-bold py-3 px-3 border-l border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        colSpan={3}
                      >
                        Sekolah Rusak
                      </TableHead>
                    </TableRow>
                    <TableRow className="bg-white dark:bg-slate-950 text-[10px] uppercase tracking-wide border-b border-slate-200 dark:border-slate-800">
                      <TableHead className="sticky left-0 z-40 w-[45px] py-2 px-2 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"></TableHead>
                      <TableHead className="sticky left-[45px] z-40 py-2 px-2 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"></TableHead>
                      <TableHead colSpan={7}></TableHead>
                      <TableHead className="text-center font-semibold py-2 px-2 text-slate-600 dark:text-slate-400">
                        Ringan
                      </TableHead>
                      <TableHead className="text-center font-semibold py-2 px-2 text-slate-600 dark:text-slate-400">
                        Sedang
                      </TableHead>
                      <TableHead className="text-center font-semibold py-2 px-2 text-slate-600 dark:text-slate-400">
                        Berat
                      </TableHead>
                      <TableHead className="text-center font-semibold py-2 px-2 border-l border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        Ringan
                      </TableHead>
                      <TableHead className="text-center font-semibold py-2 px-2 text-slate-600 dark:text-slate-400">
                        Sedang
                      </TableHead>
                      <TableHead className="text-center font-semibold py-2 px-2 text-slate-600 dark:text-slate-400">
                        Berat
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={`text-[13px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 ${index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/30 dark:bg-slate-900/30'}`}
                      >
                        <TableCell className="sticky left-0 z-140 w-[45px] font-semibold text-slate-500 dark:text-slate-400 py-3 px-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                          {item.no}
                        </TableCell>
                        <TableCell className="sticky left-[45px] z-140 font-semibold py-3 px-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                          {item.kecamatan}
                        </TableCell>
                        <TableCell className="text-right font-medium py-3 px-3 text-slate-700 dark:text-slate-300">
                          {formatNumber(item.jumlah_penduduk)}
                        </TableCell>
                        <TableCell className="text-center text-red-600 dark:text-red-400 font-bold py-3 px-3">
                          {item.meninggal > 0 ? formatNumber(item.meninggal) : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {item.luka > 0 ? formatNumber(item.luka) : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {item.hilang > 0 ? formatNumber(item.hilang) : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {item.belum_ter_evakuasi > 0
                            ? formatNumber(item.belum_ter_evakuasi)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center font-semibold py-3 px-3 text-amber-700 dark:text-amber-400">
                          {item.pengungsi_di_luar_pandan > 0
                            ? formatNumber(item.pengungsi_di_luar_pandan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {formatNumber(item.terdampak)}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 border-l border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {item.rumah_rusak_ringan > 0
                            ? formatNumber(item.rumah_rusak_ringan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {item.rumah_rusak_sedang > 0
                            ? formatNumber(item.rumah_rusak_sedang)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {item.rumah_rusak_berat > 0 ? formatNumber(item.rumah_rusak_berat) : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 border-l border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {item.sekolah_rusak_ringan > 0
                            ? formatNumber(item.sekolah_rusak_ringan)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {item.sekolah_rusak_sedang > 0
                            ? formatNumber(item.sekolah_rusak_sedang)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3 px-3 text-slate-700 dark:text-slate-300">
                          {item.sekolah_rusak_berat > 0
                            ? formatNumber(item.sekolah_rusak_berat)
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[13px] font-bold border-t-2 border-slate-300 dark:border-slate-700">
                    <TableRow>
                      <TableCell className="sticky left-0 z-140 w-[45px] bg-slate-100 dark:bg-slate-900 py-3.5 px-3 border-r border-slate-300 dark:border-slate-700">
                        Total
                      </TableCell>
                      <TableCell className="sticky left-[45px] z-140 bg-slate-100 dark:bg-slate-900 py-3.5 px-3 border-r border-slate-300 dark:border-slate-700"></TableCell>
                      <TableCell className="text-right font-bold py-3.5 px-3">
                        {formatNumber(totals.jumlah_penduduk)}
                      </TableCell>
                      <TableCell className="text-center text-red-700 dark:text-red-400 font-bold py-3.5 px-3">
                        {formatNumber(totals.meninggal)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.luka)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.hilang)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.belum_ter_evakuasi)}
                      </TableCell>
                      <TableCell className="text-center text-amber-700 dark:text-amber-400 font-bold py-3.5 px-3">
                        {formatNumber(totals.pengungsi)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.terdampak)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3 border-l border-slate-300 dark:border-slate-700">
                        {formatNumber(totals.rumah_ringan)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.rumah_sedang)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.rumah_berat)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3 border-l border-slate-300 dark:border-slate-700">
                        {formatNumber(totals.sekolah_ringan)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.sekolah_sedang)}
                      </TableCell>
                      <TableCell className="text-center font-bold py-3.5 px-3">
                        {formatNumber(totals.sekolah_berat)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>

            {filteredData.length === 0 && (
              <div
                className="rounded-2xl border-2 border-dashed bg-muted/30 p-8 md:p-12 text-center text-muted-foreground"
                role="status"
              >
                <p className="text-lg font-semibold">
                  Tidak ada data yang sesuai dengan pencarian.
                </p>
                <p className="text-sm mt-2">Coba gunakan kata kunci lain.</p>
              </div>
            )}
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}
