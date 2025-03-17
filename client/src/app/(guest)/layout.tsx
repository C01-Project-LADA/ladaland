import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import '@/app/globals.css';
import 'flag-icons/css/flag-icons.min.css';

export const metadata: Metadata = {
  title: 'Lada Land - Travel to the next level',
  description:
    'Lada Land takes your travels to the next level, combining trip planning with a global travel leaderboard to compete with others.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <Navbar />
        {children}
      </div>
    </>
  );
}
