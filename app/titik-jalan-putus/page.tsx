import type { Metadata } from 'next';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataTitikJalanPutus } from '@/utils/dataMapper';
import { TitikJalanPutus } from '@/components/titik-jalan-putus';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  title: 'Titik Jalan Putus',
  description:
    'Daftar lengkap titik jalan putus akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi rinci tentang kondisi jalan, status perbaikan, dan aksesibilitas. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  keywords: [
    'jalan putus tapteng',
    'kerusakan jalan bencana',
    'jalan rusak tapanuli tengah',
    'infrastruktur jalan',
    'akses jalan bencana',
    'perbaikan jalan tapteng',
  ],
  openGraph: {
    title: 'Titik Jalan Putus - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap titik jalan putus akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi rinci tentang kondisi jalan, status perbaikan, dan aksesibilitas.',
    url: `${siteUrl}/titik-jalan-putus`,
    images: ['/logo-tapteng.png'],
  },
  twitter: {
    title: 'Titik Jalan Putus - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap titik jalan putus akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi rinci tentang kondisi jalan, status perbaikan, dan aksesibilitas.',
  },
  alternates: {
    canonical: `${siteUrl}/titik-jalan-putus`,
  },
};

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function TitikJalanPutusPage() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData("'TITIK JALAN PUTUS'!A1:H", spreadsheetId);

  const initialData = mapSheetDataTitikJalanPutus(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <TitikJalanPutus initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
