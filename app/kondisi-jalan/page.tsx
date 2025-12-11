import type { Metadata } from 'next';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataKondisiJalan } from '@/utils/dataMapper';
import { KondisiJalan } from '@/components/kondisi-jalan';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  title: 'Kondisi Jalan',
  description:
    'Daftar lengkap kondisi jalan akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi rinci tentang kondisi jalan, status perbaikan, dan aksesibilitas. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  keywords: [
    'jalan putus tapteng',
    'kerusakan jalan bencana',
    'jalan rusak tapanuli tengah',
    'infrastruktur jalan',
    'akses jalan bencana',
    'perbaikan jalan tapteng',
  ],
  openGraph: {
    title: 'Kondisi Jalan - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap kondisi jalan akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi rinci tentang kondisi jalan, status perbaikan, dan aksesibilitas.',
    url: `${siteUrl}/titik-jalan-putus`,
    images: ['/logo-tapteng.png'],
  },
  twitter: {
    title: 'Kondisi Jalan - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap kondisi jalan putus akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi rinci tentang kondisi jalan, status perbaikan, dan aksesibilitas.',
  },
  alternates: {
    canonical: `${siteUrl}/kondisi-jalan`,
  },
};

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function KondisiJalanPage() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData("'KONDISI-JALAN'!A1:H", spreadsheetId);

  const initialData = mapSheetDataKondisiJalan(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <KondisiJalan initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
