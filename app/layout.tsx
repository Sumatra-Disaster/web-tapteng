import type React from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@/components/google-analytics';
import { MicrosoftClarity } from '@/components/microsoft-clarity';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { InstallPrompt } from '@/components/install-prompt';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Get site URL from environment variable or use default
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infobencanatapteng.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Data Bencana Banjir Bandang dan Longsor Tapanuli Tengah',
    template: '%s | BPBD Tapanuli Tengah',
  },
  description:
    'Sistem manajemen data bencana banjir bandang dan longsor untuk monitoring korban dan kerusakan infrastruktur di Kabupaten Tapanuli Tengah. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
  keywords: [
    'bencana tapteng',
    'banjir bandang tapanuli tengah',
    'longsor tapteng',
    'BPBD tapteng',
    'data bencana',
    'korban bencana',
    'pengungsi tapteng',
    'bencana alam tapanuli tengah',
    'informasi bencana',
    'disaster management',
  ],
  authors: [{ name: 'BPBD Kabupaten Tapanuli Tengah' }],
  creator: 'BPBD Kabupaten Tapanuli Tengah',
  publisher: 'BPBD Kabupaten Tapanuli Tengah',
  generator: 'Next.js',
  applicationName: 'Info Bencana Tapteng',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'Info Bencana Tapteng',
    title: 'Data Bencana Banjir Bandang dan Longsor Tapanuli Tengah',
    description:
      'Sistem manajemen data bencana banjir bandang dan longsor untuk monitoring korban dan kerusakan infrastruktur di Kabupaten Tapanuli Tengah. Data resmi dari BPBD Kabupaten Tapanuli Tengah.',
    images: [
      {
        url: '/logo-tapteng.png',
        width: 1200,
        height: 630,
        alt: 'Logo BPBD Kabupaten Tapanuli Tengah',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Bencana Banjir Bandang dan Longsor Tapanuli Tengah',
    description:
      'Sistem manajemen data bencana banjir bandang dan longsor untuk monitoring korban dan kerusakan infrastruktur di Kabupaten Tapanuli Tengah.',
    images: ['/logo-tapteng.png'],
    creator: '@BPBDTapTeng',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: 'Data Bencana Banjir Bandang dan Longsor Tapanuli Tengah',
    description:
      'Sistem manajemen data bencana banjir bandang dan longsor untuk monitoring korban dan kerusakan infrastruktur di Kabupaten Tapanuli Tengah',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'BPBD Kabupaten Tapanuli Tengah',
      url: siteUrl,
    },
    serviceType: 'Disaster Management Information',
    areaServed: {
      '@type': 'City',
      name: 'Tapanuli Tengah',
      '@id': 'https://www.wikidata.org/wiki/Q123456', // Replace with actual Wikidata ID if available
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Public',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: siteUrl,
      serviceType: 'Online',
    },
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <MicrosoftClarity />
        <ServiceWorkerRegister />
        {children}
        <InstallPrompt />
        <Analytics />
      </body>
    </html>
  );
}
