import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '신선의 산방 | 사주 × MBTI 천명 풀이',
  description: '깊은 산속 신선이 풀어주는 사주 × MBTI 천명 풀이, 오늘의 운세와 궁합까지',
  openGraph: {
    title: '신선의 산방 🧙',
    description: '생년월일과 MBTI로 신선이 풀어주는 당신만의 천명 이야기',
    type: 'website',
    locale: 'ko_KR',
  },
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
