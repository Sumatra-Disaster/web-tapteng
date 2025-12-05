import type { Metadata } from 'next';
import { DeceasedVictims } from '@/components/deceased_victims';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataDeceased } from '@/utils/dataMapper';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  title: 'Daftar Korban Meninggal',
  description:
    'Daftar lengkap korban meninggal akibat banjir bandang dan longsor di Tapanuli Tengah. Data resmi dari BPBD Kabupaten Tapanuli Tengah dengan informasi detail per korban.',
  keywords: [
    'korban meninggal tapteng',
    'korban jiwa bencana',
    'daftar korban bencana',
    'korban banjir bandang',
    'korban longsor tapteng',
    'BPBD tapteng korban',
  ],
  openGraph: {
    title: 'Daftar Korban Meninggal - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap korban meninggal akibat banjir bandang dan longsor di Tapanuli Tengah. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
    url: `${siteUrl}/daftar-korban`,
    images: ['/logo-tapteng.png'],
  },
  twitter: {
    title: 'Daftar Korban Meninggal - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap korban meninggal akibat banjir bandang dan longsor di Tapanuli Tengah. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  },
  alternates: {
    canonical: `${siteUrl}/daftar-korban`,
  },
};

export const revalidate = 300;

export default async function Home() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData('DATA-MENINGGAL!A5:N', spreadsheetId);
  const initialData = mapSheetDataDeceased(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DeceasedVictims initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
