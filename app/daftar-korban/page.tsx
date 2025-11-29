import { DeceasedVictims } from "@/components/deceased_victims";
import { getSheetData } from "../../lib/sheet/google-sheets";
import { mapSheetDataDeceased } from "@/utils/dataMapper";

export default async function Home() {
  const lastUpdate = await getSheetData(
    "DATA_MD!A2:B2",
    "1ZFPFHPU31BTnYAVjG0OoOvlYebL4y8qDolF14IMWcNY"
  );
  const data = await getSheetData(
    "DATA_MD!A6:N",
    "1ZFPFHPU31BTnYAVjG0OoOvlYebL4y8qDolF14IMWcNY"
  );

  const initialData = mapSheetDataDeceased(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DeceasedVictims initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
