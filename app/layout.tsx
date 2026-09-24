import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Labour Market Intelligence & Curriculum Alignment Platform (Problem 26134)',
  description: 'Evidence-based platform translating real-time industry demand into curriculum design, training capacity, and career pathways.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
