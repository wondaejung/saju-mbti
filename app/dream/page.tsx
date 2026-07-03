'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchDreams, getPopularKeywords, type DreamEntry, type DreamType } from '@/lib/dream';

const TYPE_STYLES: Record<DreamType, { badge: string; label: string }> = {
  길몽: { badge: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900', label: '길몽 🌕' },
  흉몽: { badge: 'bg-slate-700 text-slate-200 border border-slate-500/50', label: '흉몽 🌑' },
  중립: { badge: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white', label: '해석에 따라 🌗' },
};

export default function DreamPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DreamEntry[] | null>(null);
  const [searched, setSearched] = useState('');

  const runSearch = (keyword: string) => {
    const q = keyword.trim();
    if (!q) return;
    setQuery(q);
    setSearched(q);
    setResults(searchDreams(q));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <main className="min-h-screen px-4 py-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-purple-400 hover:text-purple-300 text-sm font-semibold mb-4 inline-block transition-colors"
          >
            ← 산방으로 돌아가기
          </button>
          <div className="text-4xl mb-2">🌙</div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
            꿈의 해몽
          </h1>
          <p className="text-purple-300/70 text-sm font-light mt-2">간밤의 꿈을 신선에게 들려줄지어다</p>
        </div>

        {/* 검색 */}
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="꿈에 나온 것을 적어보게나 (예: 뱀, 이빨, 물)"
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-purple-500/30 bg-slate-900/50 text-purple-100 focus:outline-none focus:border-purple-400 transition placeholder-purple-500/50"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition shadow-lg shrink-0"
            >
              🔍 해몽
            </button>
          </div>
        </form>

        {/* 인기 키워드 */}
        <div className="mb-8">
          <p className="text-purple-400/70 text-xs mb-2 font-light">많이 찾는 꿈</p>
          <div className="flex flex-wrap gap-2">
            {getPopularKeywords().map((keyword) => (
              <button
                key={keyword}
                onClick={() => runSearch(keyword)}
                className="px-3 py-1.5 rounded-full text-sm text-purple-200 bg-purple-900/40 border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-800/50 transition"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 결과 */}
        {results !== null && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <p className="text-purple-300/80 text-sm text-center">
                  「{searched}」에 대해 신선이 {results.length}가지 풀이를 찾았노라
                </p>
                {results.map((entry) => (
                  <div
                    key={entry.keyword}
                    className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-purple-200">
                        {entry.keyword}
                        <span className="text-purple-400/60 text-xs font-normal ml-2">{entry.category}</span>
                      </h2>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${TYPE_STYLES[entry.type].badge}`}>
                        {TYPE_STYLES[entry.type].label}
                      </span>
                    </div>
                    <p className="text-purple-100/90 leading-7 text-[15px] sm:text-base">{entry.meaning}</p>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md rounded-3xl p-8 border border-purple-500/20 text-center">
                <div className="text-4xl mb-3">🧙</div>
                <p className="text-purple-200 font-semibold mb-2">허어... 신선도 처음 보는 꿈이로다</p>
                <p className="text-purple-300/70 text-sm font-light">
                  꿈에 나온 것을 한 단어로 줄여서 다시 물어볼지어다.
                  <br />
                  (예: &quot;큰 구렁이가 나왔어요&quot; → &quot;뱀&quot;)
                </p>
              </div>
            )}
          </div>
        )}

        {/* 하단 안내 */}
        {results === null && (
          <div className="text-center text-purple-300/50 text-sm font-light mt-12">
            <p>💤 꿈은 마음이 보내는 편지이니</p>
            <p>한 단어로 물으면 신선이 그 뜻을 풀어주리라</p>
          </div>
        )}
      </div>
    </main>
  );
}
