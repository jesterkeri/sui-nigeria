import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cuttlefish',
  description: 'Learn, build, and grow on Sui. Cuttlefish is the open learning platform for the Sui ecosystem.',
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
