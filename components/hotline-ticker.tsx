'use client';

import { Megaphone, PhoneCall } from 'lucide-react';

const HOTLINE_NUMBER = '0812-9090-0222';
const HOTLINE_LINK = 'tel:081290900222';
const tickerMessages = [
  'Hotline darurat aktif 24 jam – hubungi kami saat butuh bantuan cepat',
  'Laporkan kondisi genting, kebutuhan logistik, atau permintaan evakuasi',
  'Tim BPBD siap merespons laporan masyarakat di seluruh TapTeng',
];

export function HotlineTicker() {
  const renderTickerItems = () =>
    tickerMessages.map((message, index) => (
      <span key={`${message}-${index}`} className="text-sm sm:text-base">
        {message}
      </span>
    ));

  return (
    <div className="pointer-events-none fixed inset-x-3 top-4 z-50 flex justify-center sm:top-6">
      <section
        aria-label="Informasi hotline darurat"
        className="pointer-events-auto w-full max-w-4xl rounded-3xl border border-white/20 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 text-white shadow-2xl shadow-red-500/30 backdrop-blur"
      >
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-1 items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-2 text-white">
              <Megaphone className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                Hotline darurat
              </p>
              <p className="text-2xl font-bold tracking-wide">{HOTLINE_NUMBER}</p>
              <p className="text-sm text-white/80">
                Segera hubungi untuk evakuasi dan laporan warga.
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/30 bg-white/10 px-4 py-2">
              <div className="flex min-w-full items-center gap-8 whitespace-nowrap animate-marquee">
                {renderTickerItems()}
              </div>
              <div
                className="flex min-w-full items-center gap-8 whitespace-nowrap animate-marquee"
                aria-hidden
              >
                {renderTickerItems()}
              </div>
            </div>
            <a
              href={HOTLINE_LINK}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-white"
            >
              <PhoneCall className="h-4 w-4" aria-hidden />
              Hubungi BPBD TapTeng
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
