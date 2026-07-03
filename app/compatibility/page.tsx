'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateCompatibility, type CompatibilityResult, type PersonInput } from '@/lib/compatibility';
import type { MBTI } from '@/lib/interpretations';

const MBTI_OPTIONS = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ', 'ESTP', 'ESFP', 'ENFP', 'ENTP'] as const;

const ELEMENT_KOREAN: Record<string, string> = {
  목: '목(木)',
  화: '화(火)',
  토: '토(土)',
  금: '금(金)',
  수: '수(水)',
};

interface PersonForm {
  name: string;
  year: number;
  month: number;
  day: number;
  mbti: MBTI;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function PersonCard({
  title,
  emoji,
  person,
  onChange,
}: {
  title: string;
  emoji: string;
  person: PersonForm;
  onChange: (next: PersonForm) => void;
}) {
  const daysInMonth = new Date(person.year, person.month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const updateDate = (patch: Partial<Pick<PersonForm, 'year' | 'month' | 'day'>>) => {
    const next = { ...person, ...patch };
    const maxDay = new Date(next.year, next.month, 0).getDate();
    onChange({ ...next, day: Math.min(next.day, maxDay) });
  };

  const selectClass =
    'px-2 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition text-center cursor-pointer';

  return (
    <div className="bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-md rounded-3xl p-5 border border-purple-500/20">
      <h2 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
        <span className="text-2xl">{emoji}</span> {title}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-300 mb-2">성함</label>
        <input
          type="text"
          value={person.name}
          onChange={(e) => onChange({ ...person, name: e.target.value })}
          placeholder="이름"
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition placeholder-purple-500/50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-300 mb-2">생년월일</label>
        <div className="grid grid-cols-3 gap-2">
          <select value={person.year} onChange={(e) => updateDate({ year: parseInt(e.target.value) })} className={selectClass}>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select value={person.month} onChange={(e) => updateDate({ month: parseInt(e.target.value) })} className={selectClass}>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <select value={person.day} onChange={(e) => updateDate({ day: parseInt(e.target.value) })} className={selectClass}>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-purple-300 mb-2">MBTI</label>
        <select
          value={person.mbti}
          onChange={(e) => onChange({ ...person, mbti: e.target.value as MBTI })}
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition cursor-pointer"
        >
          {MBTI_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function CompatibilityPage() {
  const router = useRouter();
  const [personA, setPersonA] = useState<PersonForm>({ name: '', year: 2000, month: 1, day: 1, mbti: 'ISTJ' });
  const [personB, setPersonB] = useState<PersonForm>({ name: '', year: 2000, month: 1, day: 1, mbti: 'ISTJ' });
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [names, setNames] = useState<{ a: string; b: string }>({ a: '', b: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!personA.name.trim() || !personB.name.trim()) {
      setError('두 사람의 이름을 모두 입력할지어다.');
      return;
    }

    try {
      const compatibility = calculateCompatibility(personA as PersonInput, personB as PersonInput);
      setNames({ a: personA.name, b: personB.name });
      setResult(compatibility);
    } catch (err) {
      setError('궁합 계산 중 오류가 생겼노라. 날짜를 다시 확인할지어다.');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 relative z-10">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-purple-400 hover:text-purple-300 text-sm font-semibold mb-4 inline-block transition-colors"
          >
            ← 산방으로 돌아가기
          </button>
          <div className="text-4xl mb-2">💕</div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
            인연의 궁합
          </h1>
          <p className="text-purple-300/70 text-sm font-light mt-2">두 영혼의 실이 어떻게 이어져 있는지 신선이 읽어주노라</p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <PersonCard title="첫 번째 영혼" emoji="🌞" person={personA} onChange={setPersonA} />
            <PersonCard title="두 번째 영혼" emoji="🌙" person={personB} onChange={setPersonB} />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-semibold mb-4 bg-red-900/30 border border-red-500/30 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition shadow-lg hover:shadow-pink-500/50 text-lg"
          >
            💞 두 인연을 읽다 💞
          </button>
        </form>

        {/* 궁합 결과 */}
        {result && (
          <div className="mt-8 space-y-5">
            {/* 점수 */}
            <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-pink-900/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-500/20 text-center">
              <p className="text-purple-300/80 text-sm mb-2">
                {names.a} {ELEMENT_KOREAN[result.elementA]} × {names.b} {ELEMENT_KOREAN[result.elementB]}
              </p>
              <div className="text-6xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-3">
                {result.score}점
              </div>
              <div className="w-full bg-slate-800/60 rounded-full h-4 overflow-hidden border border-pink-500/20 mb-4">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <p className="text-pink-200 font-semibold text-lg">{result.summary}</p>
            </div>

            {/* 오행 관계 */}
            <div className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-500/20">
              <h3 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
                <span>⚛️</span> 오행이 말하는 인연 — {result.relation}
              </h3>
              <p className="text-purple-100/90 leading-7 text-[15px] sm:text-base">{result.relationText}</p>
            </div>

            {/* MBTI 시너지 */}
            <div className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-500/20">
              <h3 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
                <span>🔮</span> 두 영혼의 결
              </h3>
              <div className="space-y-3">
                {result.mbtiTexts.map((text, i) => (
                  <p key={i} className="text-purple-100/90 leading-7 text-[15px] sm:text-base border-l-2 border-pink-500/40 pl-4">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
