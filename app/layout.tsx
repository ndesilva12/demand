import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Demand - Stop Asking. Start Demanding.',
  description: 'Create structured demands with measurable outcomes. Build coalitions. Force corporations to change. Join 892,000+ people demanding corporate accountability.',
  keywords: ['corporate accountability', 'consumer rights', 'demands', 'petition alternative', 'corporate change'],
  openGraph: {
    title: 'Demand - Stop Asking. Start Demanding.',
    description: 'Create structured demands with measurable outcomes. Build coalitions. Force corporations to change.',
    url: 'https://demandchange.vercel.app',
    siteName: 'Demand',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demand - Stop Asking. Start Demanding.',
    description: 'Create structured demands with measurable outcomes. Build coalitions. Force corporations to change.',
  },
  metadataBase: new URL('https://demandchange.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Demand',
              url: 'https://demandchange.vercel.app',
              description: 'Consumer-powered corporate accountability platform. Create structured demands, build coalitions, force change.',
              applicationCategory: 'SocialNetworkingApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
