import { DisasterDashboard } from "@/components/disaster-dashboard";
import { getSheetData } from "../lib/sheet/google-sheets";
import { mapSheetData } from "@/utils/dataMapper";

export default async function Home() {
  const lastUpdate = await getSheetData(
    "DATA_BENCANA!A2:B2",
    "1ZFPFHPU31BTnYAVjG0OoOvlYebL4y8qDolF14IMWcNY"
  );
  const data = await getSheetData(
    "DATA_BENCANA!A6:N",
    "1ZFPFHPU31BTnYAVjG0OoOvlYebL4y8qDolF14IMWcNY"
  );

  const initialData = mapSheetData(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DisasterDashboard initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
