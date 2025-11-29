import { Paperclip, Phone } from "lucide-react"; // Asumsikan Paperclip dan Phone diimpor

export function Footer() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 rounded-lg bg-secondary text-secondary-foreground shadow-lg border border-secondary/50">
      {/* 1. Sumber Data (Menggunakan Paperclip Icon) */}
      <div className="flex items-center gap-3">
        <div className="text-primary">
          <Paperclip className="h-5 w-5" />
        </div>
        <p className="text-sm md:text-base font-medium">
          <span className="font-semibold text-primary">Sumber Data:</span> BPBD
          (BADAN PENANGGULANGAN BENCANA DAERAH) KABUPATEN TAPANULI TENGAH.
        </p>
      </div>

      {/* 2. Call Center Darurat (Menggunakan Phone Icon) */}
      <div className="flex items-center gap-3">
        <div className="text-destructive">
          <Phone className="h-5 w-5" />
        </div>
        <p className="text-sm md:text-base font-medium">
          <span className="font-semibold">Call Center Darurat:</span>{" "}
          <a
            href="tel:081290900222"
            className="text-destructive/90 hover:text-destructive underline font-bold transition-colors"
          >
            0812-9090-0222
          </a>
        </p>
      </div>
    </div>
  );
}
