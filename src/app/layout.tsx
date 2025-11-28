import type { Metadata } from 'next';
import { Work_Sans, Playfair_Display } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBusinessSettingsWithFallback } from '@/lib/business-settings';
import '@/styles/globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-secondary',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Revitalizing Massage | Professional Massage Therapy',
  description: 'Professional massage therapy services to help you relax, recover, and rejuvenate. Book your appointment today.',
  keywords: 'massage, massage therapy, Swedish massage, deep tissue, relaxation, wellness, spa',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch business settings for header and footer
  const businessSettings = await getBusinessSettingsWithFallback();

  return (
    <ClerkProvider>
      <html lang="en" className={`${workSans.variable} ${playfair.variable}`}>
        <body>
          <Header businessSettings={businessSettings} />
          <main>{children}</main>
          <Footer businessSettings={businessSettings} />
        </body>
      </html>
    </ClerkProvider>
  );
}
