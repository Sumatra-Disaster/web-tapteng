import type { Metadata } from 'next';
import { DisasterDashboard } from '@/components/disaster-dashboard';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../lib/sheet/google-sheets';
import {
  mapSheetData,
  mapSheetDataRefugee,
  mapSheetDataHelipad,
  mapSheetDataKondisiJalan,
} from '@/utils/dataMapper';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  title: 'Dashboard Data Bencana',
  description:
    'Dashboard lengkap data bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi real-time tentang korban, pengungsi, dan kerusakan infrastruktur per kecamatan. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  keywords: [
    'dashboard bencana tapteng',
    'data bencana tapanuli tengah',
    'statistik bencana',
    'korban bencana tapteng',
    'pengungsi tapteng',
    'kerusakan infrastruktur',
  ],
  openGraph: {
    title: 'Dashboard Data Bencana Tapanuli Tengah',
    description:
      'Dashboard lengkap data bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi real-time tentang korban, pengungsi, dan kerusakan infrastruktur.',
    url: siteUrl,
    images: ['/logo-tapteng.png'],
  },
  twitter: {
    title: 'Dashboard Data Bencana Tapanuli Tengah',
    description:
      'Dashboard lengkap data bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi real-time tentang korban, pengungsi, dan kerusakan infrastruktur.',
  },
  alternates: {
    canonical: siteUrl,
  },
};

// Force dynamic rendering - always fetch fresh data on server
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData('KECAMATAN!A5:O', spreadsheetId);
  const poskoData = await getSheetData("'POSKO PENGUNGSIAN'!B4:E", spreadsheetId);
  const helipadData = await getSheetData("'TITIK-LOKASI-HELIDROP'!A3:F", spreadsheetId);
  const jalanPutusData = await getSheetData("'KONDISI-JALAN'!A1:H", spreadsheetId);

  const totalPosko = mapSheetDataRefugee(poskoData ?? []);
  const helipadLocations = mapSheetDataHelipad(helipadData ?? []);
  const kondisiJalanLocations = mapSheetDataKondisiJalan(jalanPutusData ?? []);

  const initialData = mapSheetData(data ?? []);
  console.log(initialData);

  return (
    <main className="min-h-screen bg-background">
      <DisasterDashboard
        initialData={initialData}
        lastUpdate={lastUpdate}
        totalPosko={totalPosko.totalPosko}
        totalHelipadLocations={helipadLocations.length}
        totalKondisiJalan={kondisiJalanLocations.length}
      />
    </main>
  );
}
