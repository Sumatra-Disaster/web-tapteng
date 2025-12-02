import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Data Bencana Banjir Bandang dan Longsor Tapanuli Tengah',
    short_name: 'Info Bencana Tapteng',
    description:
      'Sistem manajemen data bencana banjir bandang dan longsor untuk monitoring korban dan kerusakan infrastruktur',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#252525',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    orientation: 'portrait-primary',
    categories: ['government', 'utility', 'productivity'],
    lang: 'id',
    dir: 'ltr',
  };
}
