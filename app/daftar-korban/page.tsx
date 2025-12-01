import { DeceasedVictims } from '@/components/deceased_victims';
import { BackToHomeButton } from '@/components/back-button';
import { getSheetData, getSheetLastUpdate } from '../../lib/sheet/google-sheets';
import { mapSheetDataDeceased } from '@/utils/dataMapper';

export const revalidate = 300;

export default async function Home() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw new Error('Missing GOOGLE_SHEETS_SPREADSHEET_ID environment variable.');
  }

  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData('DATA-MENINGGAL!A4:N', spreadsheetId);

  const initialData = mapSheetDataDeceased(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <BackToHomeButton />

      <DeceasedVictims initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
