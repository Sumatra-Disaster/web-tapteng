import { DeceasedVictims } from '@/components/deceased_victims';
import { getSheetData, getSheetLastUpdate } from '../../lib/sheet/google-sheets';
import { mapSheetDataDeceased } from '@/utils/dataMapper';

export const revalidate = 300;

export default async function Home() {
  const spreadsheetId = '1eh29yJ4iDHpDgpn0WEaEje42bzWV5M6OHKxUo7F4KMc';

  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData('DATA-MENINGGAL!A4:N', spreadsheetId);

  const initialData = mapSheetDataDeceased(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DeceasedVictims initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
