import { calculateSaju, getPillarByHangul } from '@fullstackfamily/manseryeok';
import { extractYilgan, getMainSipseong, getWangsangForElements, type Tiangan, type Sipseong, type Wangsang } from './saju-analysis';

export type Element = '목' | '화' | '토' | '금' | '수';

const ELEMENTS: Element[] = ['목', '화', '토', '금', '수'];

export interface ElementDistribution {
  elementCounts: Record<Element, number>;
  elementPercentages: Record<Element, number>;
  dominantElement: Element;
}

export interface SajuData {
  pillars: {
    year: string;
    month: string;
    day: string;
    hour: string | null;
  };
  pillarsHanja: {
    year: string;
    month: string;
    day: string;
    hour: string | null;
  };
  isTimeCorrected: boolean;
  correctedTime?: {
    hour: number;
    minute: number;
  };
}

export interface SajuWithElements extends SajuData, ElementDistribution {
  yilgan: Tiangan;
  mainSipseong: Sipseong;
  wangsangStatus: Record<Element, Wangsang>;
}

export function calculateSajuWithElements(
  year: number,
  month: number,
  day: number,
  hour?: number,
  minute: number = 0,
  options?: { longitude?: number; applyTimeCorrection?: boolean }
): SajuWithElements {
  const saju = calculateSaju(year, month, day, hour, minute, options);

  const pillarHanguls = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar].filter(
    (p): p is string => p !== null
  );

  const elementCounts: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (const hangul of pillarHanguls) {
    const pillar = getPillarByHangul(hangul);
    if (!pillar) continue;
    elementCounts[pillar.tiangan.element as Element] += 1;
    elementCounts[pillar.dizhi.element as Element] += 1;
  }

  const total = pillarHanguls.length * 2;
  const elementPercentages: Record<Element, number> = {} as Record<Element, number>;
  for (const element of ELEMENTS) {
    elementPercentages[element] = total > 0 ? Math.round((elementCounts[element] / total) * 1000) / 10 : 0;
  }

  const dominantElement = ELEMENTS.reduce((max, el) => (elementCounts[el] > elementCounts[max] ? el : max), ELEMENTS[0]);

  // 일간 / 주요 십성 / 오행별 왕상휴수사 분석
  const yilgan = extractYilgan(saju.dayPillar);
  const mainSipseong = getMainSipseong(yilgan, [saju.yearPillar, saju.monthPillar, saju.hourPillar]);
  const wangsangStatus = getWangsangForElements(month) as Record<Element, Wangsang>;

  return {
    pillars: {
      year: saju.yearPillar,
      month: saju.monthPillar,
      day: saju.dayPillar,
      hour: saju.hourPillar,
    },
    pillarsHanja: {
      year: saju.yearPillarHanja,
      month: saju.monthPillarHanja,
      day: saju.dayPillarHanja,
      hour: saju.hourPillarHanja,
    },
    isTimeCorrected: saju.isTimeCorrected,
    correctedTime: saju.correctedTime,
    elementCounts,
    elementPercentages,
    dominantElement,
    yilgan,
    mainSipseong,
    wangsangStatus,
  };
}
