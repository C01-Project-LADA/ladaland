import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import '@/app/globals.css';

const nunito_sans = Nunito_Sans({
  // variable: '--font-nunito_sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lada Land',
  description:
    'Lada Land takes your travels to the next level, combining trip planning with a global travel leaderboard to compete with others.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito_sans.className} antialiased flex`}>
        <div className="mr-auto ml-auto flex gap-[50px]">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
