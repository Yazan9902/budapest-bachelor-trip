import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { trip } from './trip-data';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const siteDescription = 'Budapest trip schedule, flights, bookings, maps, tickets and apartment status.';

export const dynamic = 'force-static';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#3157e5',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${trip.name} · ${trip.dateLabel}`,
  description: siteDescription,
  openGraph: {
    title: trip.name,
    description: trip.dateLabel,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: `${trip.name} · ${trip.dateLabel}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: trip.name,
    description: siteDescription,
    images: [`${siteUrl}/og.png`],
  },
  appleWebApp: {
    capable: true,
    title: 'Budapest Trip',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
