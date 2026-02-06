import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '고객이 뭐라고 해? - AI 대화 분석',
  description: 'AI 기반 고객 대화 분석 도구',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>
        <main className="h-screen overflow-auto">{children}</main>
      </body>
    </html>
  );
}
