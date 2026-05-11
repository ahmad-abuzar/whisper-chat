import type { Metadata } from 'next';
import './globals.css';
import '@/styles/animations.css';

export const metadata: Metadata = {
  title: 'Whisper Chat',
  description: 'Real-time chat powered by Supabase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0b141a] text-white antialiased">{children}</body>
    </html>
  );
}
