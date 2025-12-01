import Link from 'next/link';
import { Button } from '@/components/ui/button';

type BackToHomeButtonProps = {
  label?: string;
};

export function BackToHomeButton({ label = '← Kembali ke Beranda' }: BackToHomeButtonProps) {
  return (
    <div className="p-4">
      <Button asChild variant="ghost" size="sm">
        <Link href="/">{label}</Link>
      </Button>
    </div>
  );
}
