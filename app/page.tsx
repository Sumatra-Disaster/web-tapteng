import { DisasterDashboard } from "@/components/disaster-dashboard"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  const { data: disasterData, error } = await supabase
    .from("disaster_data")
    .select("*")
    .order("no", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching disaster data:", error)
  }

  return (
    <main className="min-h-screen bg-background">
      <DisasterDashboard initialData={disasterData || []} />
    </main>
  )
}
