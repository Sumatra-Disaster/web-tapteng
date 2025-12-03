import type { Metadata } from 'next';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataRefugee } from '@/utils/dataMapper';
import { Posko } from '@/components/posko';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  title: 'Posko Pengungsian',
  description:
    'Informasi lengkap posko pengungsian untuk korban bencana banjir bandang dan longsor di Tapanuli Tengah. Lokasi, kapasitas, dan jumlah pengungsi di setiap posko. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  keywords: [
    'posko pengungsian tapteng',
    'lokasi posko pengungsian',
    'posko bencana tapanuli tengah',
    'tempat pengungsian',
    'shelter bencana',
    'posko evakuasi',
  ],
  openGraph: {
    title: 'Posko Pengungsian - Bencana Tapanuli Tengah',
    description:
      'Informasi lengkap posko pengungsian untuk korban bencana banjir bandang dan longsor di Tapanuli Tengah. Lokasi, kapasitas, dan jumlah pengungsi di setiap posko.',
    url: `${siteUrl}/posko`,
    images: ['/logo-tapteng.png'],
  },
  twitter: {
    title: 'Posko Pengungsian - Bencana Tapanuli Tengah',
    description:
      'Informasi lengkap posko pengungsian untuk korban bencana banjir bandang dan longsor di Tapanuli Tengah. Lokasi, kapasitas, dan jumlah pengungsi di setiap posko.',
  },
  alternates: {
    canonical: `${siteUrl}/posko`,
  },
};

export const revalidate = 300;

export default async function RefugeeDashboard() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData("'POSKO PENGUNGSIAN'!B4:E", spreadsheetId);

  const initialData = mapSheetDataRefugee(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <Posko initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
