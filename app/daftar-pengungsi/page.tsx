import type { Metadata } from 'next';
import { Evacuees } from '@/components/evacuees';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataEvacuee } from '../../utils/dataMapper';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  title: 'Daftar Pengungsi',
  description:
    'Daftar lengkap pengungsi akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi pengungsi di berbagai lokasi posko pengungsian. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  keywords: [
    'pengungsi tapteng',
    'daftar pengungsi bencana',
    'pengungsi banjir bandang',
    'posko pengungsian',
    'evakuasi tapteng',
    'pengungsi longsor',
  ],
  openGraph: {
    title: 'Daftar Pengungsi - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap pengungsi akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi pengungsi di berbagai lokasi posko pengungsian.',
    url: `${siteUrl}/daftar-pengungsi`,
    images: ['/logo-tapteng.png'],
  },
  twitter: {
    title: 'Daftar Pengungsi - Bencana Tapanuli Tengah',
    description:
      'Daftar lengkap pengungsi akibat bencana banjir bandang dan longsor di Tapanuli Tengah. Informasi pengungsi di berbagai lokasi posko pengungsian.',
  },
  alternates: {
    canonical: `${siteUrl}/daftar-pengungsi`,
  },
};

export const revalidate = 300;

export default async function EvacueesPage() {
  const spreadsheetId = getSpreadsheetId();
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);

  const [tukkaRaw, gorPandanRaw, hotelHasianRaw, jayaGreenRaw, sibuluanNauliRaw] =
    await Promise.all([
      getSheetData('PENGUNSI-TUKKA!B7:B', spreadsheetId),
      getSheetData('PENGUNSI-GOR PANDAN!B6:B', spreadsheetId),
      getSheetData('PENGUNGSI-HOTEL HASIAN DAN CC!B8:B', spreadsheetId),
      getSheetData('PENGUNGSI-JAYA GREEN!B7:B', spreadsheetId),
      getSheetData('PENGUNGSI-LINK 1 SIBULUAN NAULI!B2:B', spreadsheetId),
    ]);

  const tukka = mapSheetDataEvacuee(tukkaRaw ?? [], 'Kecamatan Tukka');
  const gorPandan = mapSheetDataEvacuee(gorPandanRaw ?? [], 'Gedung Serba Guna Pandan');
  const hotelHasian = mapSheetDataEvacuee(
    hotelHasianRaw ?? [],
    'Hotel Hasian / Pastoran Santo Yosef',
  );
  const jayaGreen = mapSheetDataEvacuee(jayaGreenRaw ?? [], 'Jaya Green - Terminal Baru');
  const sibuluanNauli = mapSheetDataEvacuee(
    sibuluanNauliRaw ?? [],
    'Huta Godang Kel. Sibuluan Nauli',
  );

  const initialData = [...tukka, ...gorPandan, ...hotelHasian, ...jayaGreen, ...sibuluanNauli];

  return (
    <main className="min-h-screen bg-background">
      <Evacuees initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
