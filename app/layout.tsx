import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '사주 × MBTI | 당신의 이야기를 찾아보세요',
  description: '생년월일과 MBTI로 만나는 당신만의 사주 이야기',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-cute">
        {children}
      </body>
    </html>
  );
}
