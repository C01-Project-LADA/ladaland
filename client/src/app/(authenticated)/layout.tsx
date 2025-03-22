import type { Metadata } from 'next';
import SideNavigation from '@/components/SideNavigation';
import Dashboard from '@/components/Dashboard';
import { Toaster } from '@/components/ui/sonner';
import '@/app/globals.css';
import 'flag-icons/css/flag-icons.min.css';

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
    <>
      <SideNavigation />
      <div className="mr-auto ml-auto flex gap-[50px]">
        {children}
        <Dashboard />
      </div>

      <Toaster />
    </>
  );
}
