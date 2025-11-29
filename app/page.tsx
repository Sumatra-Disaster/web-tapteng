import { DisasterDashboard } from "@/components/disaster-dashboard";
import { getSheetData } from "../lib/sheet/google-sheets";
import { mapSheetData } from "@/utils/dataMapper";

export default async function Home() {
  const data = await getSheetData("DATA_BENCANA!A4:N");

  const initialData = mapSheetData(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DisasterDashboard initialData={initialData} />
    </main>
  );
}
