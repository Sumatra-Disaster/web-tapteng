import { getSheetData, getSheetLastUpdate } from '../../lib/sheet/google-sheets';
import { mapSheetDataRefugee } from '@/utils/dataMapper';
import { Posko } from '@/components/posko';

export const revalidate = 300;

export default async function RefugeeDashboard() {
  const spreadsheetId = '11lz-JRqZm7nRt1Ya4ARFPFv4MoMEn72G2ChoaBsewaI';

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
