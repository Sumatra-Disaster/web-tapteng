import { DisasterDashboard } from '@/components/disaster-dashboard';
import { getSheetData, getSheetLastUpdate } from '../lib/sheet/google-sheets';
import { mapSheetData } from '@/utils/dataMapper';

export default async function Home() {
  const spreadsheetId = '1eh29yJ4iDHpDgpn0WEaEje42bzWV5M6OHKxUo7F4KMc';

  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData('KECAMATAN!A5:O', spreadsheetId);

  const initialData = mapSheetData(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DisasterDashboard initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
