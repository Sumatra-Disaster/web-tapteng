import type { Metadata } from 'next';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataHelipad } from '@/utils/dataMapper';
import { HelipadLocations } from '@/components/helipad-locations';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  title: 'Titik Lokasi Helipad',
  description:
    'Peta dan daftar lengkap titik lokasi helipad dan helidrop untuk operasi evakuasi dan bantuan bencana di Tapanuli Tengah. Informasi koordinat dan aksesibilitas lokasi. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  keywords: [
    'helipad tapteng',
    'lokasi helipad bencana',
    'helidrop tapanuli tengah',
    'titik evakuasi udara',
    'landing zone bencana',
    'helipad emergency',
  ],
  openGraph: {
    title: 'Titik Lokasi Helipad - Bencana Tapanuli Tengah',
    description:
      'Peta dan daftar lengkap titik lokasi helipad dan helidrop untuk operasi evakuasi dan bantuan bencana di Tapanuli Tengah.',
    url: `${siteUrl}/titik-lokasi-helipad`,
    images: ['/logo-tapteng.png'],
  },
  twitter: {
    title: 'Titik Lokasi Helipad - Bencana Tapanuli Tengah',
    description:
      'Peta dan daftar lengkap titik lokasi helipad dan helidrop untuk operasi evakuasi dan bantuan bencana di Tapanuli Tengah.',
  },
  alternates: {
    canonical: `${siteUrl}/titik-lokasi-helipad`,
  },
};

export const revalidate = 300;

export default async function HelipadLocationsPage() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData("'TITIK-LOKASI-HELIDROP'!A3:F", spreadsheetId);

  const initialData = mapSheetDataHelipad(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <HelipadLocations initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
