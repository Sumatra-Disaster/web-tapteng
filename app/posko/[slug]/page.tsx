import { RefugeeDetail } from '@/components/refugee/detail';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function RefugeeDetailDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) return notFound();

  return (
    <main className="min-h-screen bg-background">
      <RefugeeDetail slug={slug} />
    </main>
  );
}
