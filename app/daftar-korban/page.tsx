import { DeceasedVictims } from '@/components/deceased_victims';
import { getSheetData, getSheetLastUpdate } from '../../lib/sheet/google-sheets';
import { mapSheetDataDeceased } from '@/utils/dataMapper';

export const revalidate = 300;

export default async function Home() {
  const spreadsheetId = '11lz-JRqZm7nRt1Ya4ARFPFv4MoMEn72G2ChoaBsewaI';

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
