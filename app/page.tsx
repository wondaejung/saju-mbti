'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MBTI_OPTIONS = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ', 'ESTP', 'ESFP', 'ENFP', 'ENTP'] as const;

const PROFILE_STORAGE_KEY = 'saju-mbti-profile';

type SavedProfile = {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: string;
  minute: string;
  mbti: string;
};

function buildResultParams(profile: SavedProfile): string {
  return new URLSearchParams({
    name: profile.name,
    year: String(profile.year),
    month: String(profile.month),
    day: String(profile.day),
    hour: profile.hour,
    minute: profile.minute,
    mbti: profile.mbti,
  }).toString();
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    year: 2000,
    month: 1,
    day: 1,
    hour: '',
    minute: '0',
    unknown: false,
    mbti: 'ISTJ',
  });
  const [error, setError] = useState('');
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SavedProfile;
      if (parsed.name?.trim()) setSavedProfile(parsed);
    } catch {
      // localStorage 접근/파싱 실패 시 무시
    }
  }, []);

  // 드롭다운 선택지: 년도(최신순), 해당 월의 실제 일수만큼만 표시
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(formData.year, formData.month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 년/월이 바뀌면 일이 범위를 넘지 않도록 자동 보정 (예: 1월 31일 → 2월 선택 시 28일로)
  const updateDate = (patch: Partial<{ year: number; month: number; day: number }>) => {
    const next = { ...formData, ...patch };
    const maxDay = new Date(next.year, next.month, 0).getDate();
    setFormData({ ...next, day: Math.min(next.day, maxDay) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (formData.month < 1 || formData.month > 12) {
      setError('월은 1~12 사이여야 합니다.');
      return;
    }

    if (formData.day < 1 || formData.day > 31) {
      setError('일은 1~31 사이여야 합니다.');
      return;
    }

    const profile: SavedProfile = {
      name: formData.name.trim(),
      year: formData.year,
      month: formData.month,
      day: formData.day,
      hour: formData.unknown ? '' : formData.hour,
      minute: formData.unknown ? '0' : formData.minute,
      mbti: formData.mbti,
    };

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setSavedProfile(profile);
    } catch {
      // 저장 실패해도 결과 페이지 이동은 계속
    }

    router.push(`/result?${buildResultParams(profile)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 relative z-10">
      <div className="w-full max-w-md">
        {/* 신비로운 헤더 */}
        <div className="text-center mb-8">
          <div className="mb-3 text-5xl animate-pulse">🧙‍♂️</div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            신선의 산방
          </h1>
          <p className="text-purple-300/70 font-light">당신의 천명을 찾아오신 분이군요...</p>
        </div>

        {/* 재방문자: 오늘의 운세 바로가기 */}
        {savedProfile && (
          <button
            onClick={() => router.push(`/result?${buildResultParams(savedProfile)}`)}
            className="w-full mb-5 py-4 px-5 rounded-2xl bg-gradient-to-r from-yellow-900/40 via-purple-900/60 to-yellow-900/40 border border-yellow-500/30 hover:border-yellow-400/60 transition text-left flex items-center gap-3 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🔮</span>
            <span>
              <span className="block text-yellow-200 font-bold">{savedProfile.name}님, 오늘의 운세가 도착했노라</span>
              <span className="block text-purple-300/70 text-xs mt-0.5">눌러서 바로 확인하기 →</span>
            </span>
          </button>
        )}

        {/* 폼 - 신비로운 스타일 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-purple-500/20">
            {/* 이름 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-purple-300 mb-2">당신의 성함은?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 홍길동"
                className="w-full px-4 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition placeholder-purple-500/50"
              />
            </div>

            {/* 생년월일 - 드롭다운으로 편하게 선택 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-purple-300 mb-2">당신의 천지명(생년월일)</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={formData.year}
                  onChange={(e) => updateDate({ year: parseInt(e.target.value) })}
                  className="px-2 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition text-center cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </select>
                <select
                  value={formData.month}
                  onChange={(e) => updateDate({ month: parseInt(e.target.value) })}
                  className="px-2 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition text-center cursor-pointer"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </select>
                <select
                  value={formData.day}
                  onChange={(e) => updateDate({ day: parseInt(e.target.value) })}
                  className="px-2 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition text-center cursor-pointer"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}일
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 출생 시간 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-purple-300 mb-2">당신이 빛을 본 시각 (선택)</label>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={formData.unknown}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unknown: e.target.checked,
                      hour: '',
                      minute: '0',
                    })
                  }
                  className="w-5 h-5 accent-purple-400 cursor-pointer"
                />
                <label className="ml-2 text-sm text-purple-300/70 cursor-pointer">정확한 시각을 모르겠어요</label>
              </div>

              {!formData.unknown && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.hour}
                    onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                    onFocus={(e) => e.target.select()}
                    placeholder="시간 (0~23)"
                    className="px-3 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition text-center placeholder-purple-500/50"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.minute}
                    onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                    onFocus={(e) => e.target.select()}
                    placeholder="분 (0~59)"
                    className="px-3 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition text-center placeholder-purple-500/50"
                  />
                </div>
              )}
            </div>

            {/* MBTI */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-purple-300 mb-2">영혼의 성향(MBTI)</label>
              <select
                value={formData.mbti}
                onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition cursor-pointer"
              >
                {MBTI_OPTIONS.map((mbti) => (
                  <option key={mbti} value={mbti}>
                    {mbti}
                  </option>
                ))}
              </select>
            </div>

            {/* 에러 메시지 */}
            {error && <div className="text-red-400 text-sm font-semibold mb-3 bg-red-900/30 border border-red-500/30 p-3 rounded-lg">{error}</div>}

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition shadow-lg hover:shadow-purple-500/50 text-lg"
            >
              🔮 신선의 조언을 구하다 🔮
            </button>
          </div>
        </form>

        {/* 다른 점술 바로가기 */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Link
            href="/compatibility"
            className="block py-3 rounded-2xl text-center font-bold text-pink-200 bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-500/30 hover:border-pink-400/60 transition"
          >
            💕 인연의 궁합
          </Link>
          <Link
            href="/dream"
            className="block py-3 rounded-2xl text-center font-bold text-blue-200 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 hover:border-blue-400/60 transition"
          >
            🌙 꿈의 해몽
          </Link>
        </div>

        {/* 하단 설명 */}
        <div className="mt-6 text-center text-sm text-purple-300/70 font-light">
          <p>✨ 천지의 기운과 당신의 영혼이 만나</p>
          <p>우주의 신비가 하나의 이야기가 됩니다 ✨</p>
        </div>

        {/* 푸터 */}
        <div className="mt-12 pt-6 border-t border-purple-500/20 text-center text-xs text-purple-400/50">
          <p>made by wondae ✦</p>
        </div>
      </div>
    </main>
  );
}
