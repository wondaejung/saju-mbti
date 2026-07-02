'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { calculateSajuWithElements, type SajuWithElements, type Element } from '@/lib/utils';
import { getInterpretation, type MBTI } from '@/lib/interpretations';
import { generateFullInterpretation, type InterpretationComponents } from '@/lib/generate-interpretation';

const ELEMENT_COLORS: Record<Element, string> = {
  목: '#BAE1BA',
  화: '#FFB3D9',
  토: '#FFCB9A',
  금: '#D4C5F9',
  수: '#BAC7FF',
};

const ELEMENT_KOREAN: Record<Element, string> = {
  목: '목(木)',
  화: '화(火)',
  토: '토(土)',
  금: '금(金)',
  수: '수(水)',
};

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [saju, setSaju] = useState<SajuWithElements | null>(null);
  const [generatedInterpretation, setGeneratedInterpretation] = useState('');
  const [error, setError] = useState('');

  const name = searchParams.get('name') || '게스트';
  const year = parseInt(searchParams.get('year') || '2000');
  const month = parseInt(searchParams.get('month') || '1');
  const day = parseInt(searchParams.get('day') || '1');
  const hour = searchParams.get('hour') ? parseInt(searchParams.get('hour')!) : undefined;
  const minute = parseInt(searchParams.get('minute') || '0');
  const mbti = (searchParams.get('mbti') || 'ISTJ') as MBTI;

  useEffect(() => {
    try {
      const result = calculateSajuWithElements(year, month, day, hour, minute);
      setSaju(result);

      // 새로운 해석 생성
      const components: InterpretationComponents = {
        yilgan: result.yilgan,
        mainElement: result.dominantElement,
        mainWangsang: result.wangsangStatus[result.dominantElement as Element] as any,
        mainSipseong: result.mainSipseong,
        mbti,
        month,
      };
      const interpretation = generateFullInterpretation(components);
      setGeneratedInterpretation(interpretation);
    } catch (err) {
      setError('사주 계산 중 오류가 발생했습니다. 날짜를 다시 확인해주세요.');
      console.error(err);
    }
  }, [year, month, day, hour, minute, mbti]);

  if (!saju) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        {error && (
          <div className="text-center">
            <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition"
            >
              돌아가기
            </button>
          </div>
        )}
        {!error && <p className="text-gray-600 text-lg">로딩 중...</p>}
      </main>
    );
  }

  const interpretation = getInterpretation(saju.dominantElement, mbti);

  return (
    <main className="min-h-screen px-4 py-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* 신비로운 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-purple-400 hover:text-purple-300 text-sm font-semibold mb-4 inline-block transition-colors"
          >
            ← 산 아래로 돌아가기
          </button>
          <div className="relative mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              {name}님의 천명
            </h1>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl">✨</div>
          </div>
          <p className="text-purple-300/70 text-sm font-light">
            {year}년 {month}월 {day}일 {hour !== undefined ? `${hour}시 ${minute}분` : '시간 미설정'}의 기운
          </p>
        </div>

        {/* 사주팔자 카드 - 신비로운 스타일 */}
        <div className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-6 border border-purple-500/20">
          <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <span>📿</span> 천지인 삼재
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {['년', '월', '일', '시'].map((label, idx) => {
              const key = ['year', 'month', 'day', 'hour'][idx] as 'year' | 'month' | 'day' | 'hour';
              const pillar = saju.pillars[key];
              const pillarHanja = saju.pillarsHanja[key];

              return (
                <div
                  key={label}
                  className="bg-gradient-to-br from-purple-900/50 to-blue-900/30 rounded-2xl p-4 text-center border border-purple-500/30 hover:border-purple-400/60 transition-colors"
                >
                  <div className="text-xs text-purple-300 font-semibold mb-1">{label}주</div>
                  <div className="text-lg font-bold text-purple-100">{pillar || '-'}</div>
                  <div className="text-sm text-purple-400/80">{pillarHanja || '-'}</div>
                </div>
              );
            })}
          </div>
          {saju.isTimeCorrected && saju.correctedTime && (
            <p className="text-xs text-purple-400/70 mt-4 text-center font-light">
              ✧ 시간의 진실: {saju.correctedTime.hour}시 {saju.correctedTime.minute}분 (진태양시)
            </p>
          )}
        </div>

        {/* 오행 분포 - 신비로운 스타일 */}
        <div className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-6 border border-purple-500/20">
          <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <span>⚛️</span> 오행의 기운
          </h2>
          <div className="space-y-4">
            {(['목', '화', '토', '금', '수'] as const).map((element) => {
              const percentage = saju.elementPercentages[element];
              const count = saju.elementCounts[element];
              const isMain = element === saju.dominantElement;

              return (
                <div
                  key={element}
                  className={`rounded-2xl p-4 transition-all ${
                    isMain
                      ? 'bg-gradient-to-r from-purple-900/80 to-blue-900/60 border-2 border-purple-400/60'
                      : 'bg-slate-900/40 border border-purple-500/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-purple-200">{ELEMENT_KOREAN[element]}</span>
                      <span className="text-sm text-purple-400/70">({count}개)</span>
                      {isMain && (
                        <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full font-semibold">
                          주요 기운
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-purple-300">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-full h-3 overflow-hidden border border-purple-500/10">
                    <div
                      className="h-full transition-all duration-500 shadow-lg"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: ELEMENT_COLORS[element],
                        boxShadow: `0 0 10px ${ELEMENT_COLORS[element]}`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MBTI 정보 - 신비로운 스타일 */}
        <div className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-6 border border-purple-500/20">
          <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <span>🔮</span> 영혼의 본질
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-900/70 to-blue-900/40 rounded-2xl p-6 text-center border border-blue-500/30 hover:border-blue-400/60 transition-colors">
              <div className="text-xs text-blue-300 font-semibold mb-2">성격의 빛</div>
              <div className="text-4xl font-bold text-blue-200">{mbti}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/70 to-purple-900/40 rounded-2xl p-6 text-center border border-purple-500/30 hover:border-purple-400/60 transition-colors">
              <div className="text-xs text-purple-300 font-semibold mb-2">오행의 근원</div>
              <div className="text-4xl font-bold text-purple-200">{ELEMENT_KOREAN[saju.dominantElement]}</div>
            </div>
          </div>
        </div>

        {/* 기본 해석 (MBTI x 오행) */}
        {interpretation && (
          <div className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">{interpretation.title}</h2>
            <div className="mb-4 text-purple-100/80 leading-relaxed">{interpretation.description}</div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">✨ 당신의 강점</h3>
                <ul className="space-y-1">
                  {interpretation.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-purple-200/80">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">💭 도전 과제</h3>
                <ul className="space-y-1">
                  {interpretation.challenges.map((c, i) => (
                    <li key={i} className="text-sm text-purple-200/80">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-purple-500/20 rounded-2xl p-4">
              <h3 className="font-semibold text-purple-300 mb-2">💡 조언</h3>
              <p className="text-sm text-purple-200/80">{interpretation.advice}</p>
            </div>
          </div>
        )}

        {/* 종합 해석 (생성형) - 신비로운 신선의 목소리 */}
        {generatedInterpretation && (
          <div className="relative mb-6 group">
            {/* 신비로운 배경 글로우 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/20 to-purple-900/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

            {/* 메인 카드 */}
            <div className="relative bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              {/* 신선 이모지와 제목 */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl animate-bounce" style={{animationDuration: '3s'}}>🧙</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  신선의 말씀
                </h2>
              </div>

              {/* 구분선 */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-6"></div>

              {/* 신비로운 텍스트 */}
              <p className="text-gray-100 leading-relaxed text-lg font-light italic text-center">
                <span className="text-purple-300">"</span>
                {generatedInterpretation}
                <span className="text-purple-300">"</span>
              </p>

              {/* 하단 장식 */}
              <div className="flex justify-center gap-2 mt-6 text-purple-400/60">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
              </div>
            </div>

            {/* 코너 장식 */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg"></div>
          </div>
        )}

        {/* 하단 네비게이션 */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition shadow-lg hover:shadow-purple-500/50"
          >
            다른 영혼의 운명을 살피다
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🔮</div>
            <p className="text-purple-300">신선의 말씀을 기다리는 중...</p>
          </div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
