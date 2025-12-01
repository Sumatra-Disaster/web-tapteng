import { Paperclip, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="rounded-3xl border bg-muted/10 p-6 text-sm text-muted-foreground">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-start gap-3">
          <span className="rounded-full bg-primary/10 p-2 text-primary" aria-hidden>
            <Paperclip className="h-5 w-5" />
          </span>
          <p className="max-w-xl leading-relaxed">
            <span className="font-semibold text-foreground">Sumber data resmi:</span> BPBD Kabupaten
            Tapanuli Tengah dan laporan posko tanggap darurat terpadu.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border bg-background/80 p-4 text-foreground">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Call Center Darurat BPBD
          </p>
          <a
            href="tel:081290900222"
            className="inline-flex items-center gap-2 text-lg font-bold text-destructive hover:text-destructive/80"
          >
            <Phone className="h-5 w-5" aria-hidden /> 0812-9090-0222
          </a>
          <p className="text-xs text-muted-foreground">
            Tersedia 24 jam untuk laporan keadaan darurat.
          </p>
        </div>
      </div>
    </footer>
  );
}
