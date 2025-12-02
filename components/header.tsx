'use client';

import { PhoneCall } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  lastUpdateDate: string | null;
  showActions?: boolean;
  title: string;
}

export function Header({ lastUpdateDate, showActions = false, title }: HeaderProps) {
  const router = useRouter();

  const handleNavigateToVictims = () => {
    router.push('/daftar-korban');
  };

  return (
    <header className="flex flex-col items-center gap-6 text-center">
      {/* Logo */}
      <img
        src="/logo-tapteng.png"
        alt="Logo BPBD Kabupaten Tapanuli Tengah"
        className="h-28 w-auto"
        loading="lazy"
      />

      {/* Title & Meta Info */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Informasi Resmi BPBD Tapanuli Tengah
        </p>

        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        <p className="text-muted-foreground">
          Update terakhir:{' '}
          <span className="font-semibold">{lastUpdateDate ?? 'Tanggal tidak tersedia'}</span>
        </p>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <Button variant="secondary" onClick={handleNavigateToVictims}>
            Lihat daftar korban meninggal
          </Button>

          <Button variant="destructive" asChild>
            <a href="tel:081290900222" aria-label="Hubungi call center darurat">
              <PhoneCall />
              Hubungi BPBD TapTeng
            </a>
          </Button>
        </div>
      )}
    </header>
  );
}
