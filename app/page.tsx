import { DisasterDashboard } from '@/components/disaster-dashboard';
import { getSheetData, getSheetLastUpdate } from '../lib/sheet/google-sheets';
import { mapSheetData, mapSheetDataRefugee } from '@/utils/dataMapper';

export default async function Home() {
  const spreadsheetId = '11lz-JRqZm7nRt1Ya4ARFPFv4MoMEn72G2ChoaBsewaI';

  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData('KECAMATAN!A5:O', spreadsheetId);
  const poskoData = await getSheetData("'POSKO PENGUNGSIAN'!B4:E", spreadsheetId);

  const totalPosko = mapSheetDataRefugee(poskoData ?? []);

  const initialData = mapSheetData(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DisasterDashboard
        initialData={initialData}
        lastUpdate={lastUpdate}
        totalPosko={totalPosko.totalPosko}
      />
    </main>
  );
}
