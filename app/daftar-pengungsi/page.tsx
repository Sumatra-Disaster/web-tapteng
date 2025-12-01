import { Evacuees } from '@/components/evacuees';
import { getSheetData, getSheetLastUpdate } from '../../lib/sheet/google-sheets';
import { mapSheetDataEvacuee } from '../../utils/dataMapper';

export const revalidate = 300;

export default async function EvacueesPage() {
  const spreadsheetId = '1eh29yJ4iDHpDgpn0WEaEje42bzWV5M6OHKxUo7F4KMc';

  const lastUpdate = await getSheetLastUpdate(spreadsheetId);

  const [tukkaRaw, gorPandanRaw, hotelHasianRaw] = await Promise.all([
    getSheetData('PENGUNSI-TUKKA!B7:B', spreadsheetId),
    getSheetData('PENGUNSI-GOR PANDAN!B6:B', spreadsheetId),
    getSheetData('PENGUNGSI-HOTEL HASIAN DAN CC!B8:B', spreadsheetId),
  ]);

  const tukka = mapSheetDataEvacuee(tukkaRaw ?? [], 'Kecamatan Tukka');
  const gorPandan = mapSheetDataEvacuee(gorPandanRaw ?? [], 'Gedung Serba Guna Pandan');
  const hotelHasian = mapSheetDataEvacuee(
    hotelHasianRaw ?? [],
    'Hotel Hasian / Pastoran Santo Yosef',
  );

  const initialData = [...tukka, ...gorPandan, ...hotelHasian];

  return (
    <main className="min-h-screen bg-background">
      <Evacuees initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
