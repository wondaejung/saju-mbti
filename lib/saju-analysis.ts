import { getPillarByHangul } from '@fullstackfamily/manseryeok';

export type Tiangan = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
export type Sipseong = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '관성' | '편인' | '인성';
export type Wangsang = '왕' | '상' | '휴' | '수' | '사';

interface TianganInfo {
  name: Tiangan;
  yinYang: '양' | '음';
  element: string;
}

const TIANGAN_MAP: Record<string, TianganInfo> = {
  갑: { name: '갑', yinYang: '양', element: '목' },
  을: { name: '을', yinYang: '음', element: '목' },
  병: { name: '병', yinYang: '양', element: '화' },
  정: { name: '정', yinYang: '음', element: '화' },
  무: { name: '무', yinYang: '양', element: '토' },
  기: { name: '기', yinYang: '음', element: '토' },
  경: { name: '경', yinYang: '양', element: '금' },
  신: { name: '신', yinYang: '음', element: '금' },
  임: { name: '임', yinYang: '양', element: '수' },
  계: { name: '계', yinYang: '음', element: '수' },
};

function extractCharacter(pillarStr: string): string {
  if (!pillarStr || pillarStr.length === 0) return '';
  return pillarStr.charAt(0);
}

export function extractYilgan(gapjaOrPillars: any): Tiangan {
  let dayPillar = '';

  if (gapjaOrPillars.dayPillar) {
    dayPillar = gapjaOrPillars.dayPillar;
  } else if (gapjaOrPillars.day) {
    dayPillar = gapjaOrPillars.day;
  }

  const dayChar = extractCharacter(dayPillar);
  return (TIANGAN_MAP[dayChar]?.name || '갑') as Tiangan;
}

export function calculateSipseong(yilgan: Tiangan, other: string): Sipseong {
  const yilganInfo = TIANGAN_MAP[yilgan];
  if (!yilganInfo) return '비견';

  const otherChar = extractCharacter(other);
  const otherInfo = TIANGAN_MAP[otherChar];
  if (!otherInfo) return '비견';

  const yilganElement = yilganInfo.element;
  const yilganYinYang = yilganInfo.yinYang;
  const otherElement = otherInfo.element;
  const otherYinYang = otherInfo.yinYang;

  const elementMap: Record<string, string> = {
    목: '화',
    화: '토',
    토: '금',
    금: '수',
    수: '목',
  };

  if (yilgan === otherChar) return '비견';
  if (yilganElement === otherElement && yilganYinYang !== otherYinYang) return '겁재';

  if (elementMap[yilganElement] === otherElement) {
    return yilganYinYang === otherYinYang ? '식신' : '상관';
  }

  if (elementMap[otherElement] === yilganElement) {
    return yilganYinYang === otherYinYang ? '편인' : '인성';
  }

  const controlMap: Record<string, string> = {
    목: '토',
    화: '금',
    토: '수',
    금: '목',
    수: '화',
  };

  if (controlMap[yilganElement] === otherElement) {
    return yilganYinYang === otherYinYang ? '편재' : '정재';
  }

  if (controlMap[otherElement] === yilganElement) {
    return yilganYinYang === otherYinYang ? '편관' : '관성';
  }

  return '비견';
}

export function getMainSipseong(yilgan: Tiangan, gapjaOrPillars: any): Sipseong {
  const pillarStrings: string[] = [];

  if (gapjaOrPillars.yearPillar) {
    pillarStrings.push(gapjaOrPillars.yearPillar);
    pillarStrings.push(gapjaOrPillars.monthPillar);
    if (gapjaOrPillars.hourPillar) {
      pillarStrings.push(gapjaOrPillars.hourPillar);
    }
  } else {
    const parts = [gapjaOrPillars.year, gapjaOrPillars.month, gapjaOrPillars.hour];
    pillarStrings.push(...parts.filter((p): p is string => p !== null && p.length > 0));
  }

  const sipseongs = pillarStrings.map((p) => calculateSipseong(yilgan, p));
  const sipseongCounts: Record<Sipseong, number> = {
    비견: 0,
    겁재: 0,
    식신: 0,
    상관: 0,
    편재: 0,
    정재: 0,
    편관: 0,
    관성: 0,
    편인: 0,
    인성: 0,
  };

  sipseongs.forEach((s) => {
    sipseongCounts[s]++;
  });

  let maxSipseong: Sipseong = '비견';
  let maxCount = 0;

  for (const [s, count] of Object.entries(sipseongCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxSipseong = s as Sipseong;
    }
  }

  return maxSipseong;
}

export function calculateWangsangStatus(
  element: string,
  monthNumber: number
): Wangsang {
  const monthElement: Record<number, string> = {
    1: '목', 2: '목', 3: '화', 4: '화', 5: '토',
    6: '토', 7: '금', 8: '금', 9: '화', 10: '수',
    11: '수', 12: '토',
  };

  const season = monthElement[monthNumber] || '토';

  if (element === season) return '왕';

  const produce: Record<string, string> = {
    목: '화',
    화: '토',
    토: '금',
    금: '수',
    수: '목',
  };

  if (element === produce[season]) return '상';

  const consume: Record<string, string> = {
    목: '수',
    화: '목',
    토: '화',
    금: '토',
    수: '금',
  };

  if (element === consume[season]) return '수';

  const restriction: Record<string, string> = {
    목: '토',
    화: '금',
    토: '수',
    금: '목',
    수: '화',
  };

  if (element === restriction[season]) return '사';

  return '휴';
}

export function getWangsangForElements(
  elementCounts: Record<string, number>,
  month: number
): Record<string, Wangsang> {
  const result: Record<string, Wangsang> = {};
  ['목', '화', '토', '금', '수'].forEach((el) => {
    result[el] = calculateWangsangStatus(el, month);
  });
  return result;
}
