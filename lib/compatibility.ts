// 두 사람의 사주 오행 상생상극 + MBTI 4축 조합으로 궁합을 계산한다 (API 호출 없음)
import { calculateSajuWithElements, type Element } from './utils';
import type { MBTI } from './interpretations';

export interface PersonInput {
  name: string;
  year: number;
  month: number;
  day: number;
  mbti: MBTI;
}

export type ElementRelation = '상생' | '비화' | '상극';

const GENERATES: Record<Element, Element> = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };

function getElementRelation(a: Element, b: Element): ElementRelation {
  if (a === b) return '비화';
  if (GENERATES[a] === b || GENERATES[b] === a) return '상생';
  return '상극';
}

const ELEMENT_KOREAN: Record<Element, string> = {
  목: '목(木)',
  화: '화(火)',
  토: '토(土)',
  금: '금(金)',
  수: '수(水)',
};

const RELATION_SCORES: Record<ElementRelation, number> = { 상생: 30, 비화: 22, 상극: 12 };

function getRelationText(nameA: string, nameB: string, elA: Element, elB: Element, relation: ElementRelation): string {
  const ea = ELEMENT_KOREAN[elA];
  const eb = ELEMENT_KOREAN[elB];
  switch (relation) {
    case '상생':
      return `${nameA}의 ${ea} 기운과 ${nameB}의 ${eb} 기운은 서로를 낳고 살리는 상생(相生)의 연이로다. 함께 있을수록 서로를 자라나게 하니, 하늘이 맺어준 귀한 인연이니라.`;
    case '비화':
      return `두 사람 모두 ${ea}의 기운을 타고났으니, 말하지 않아도 통하는 오랜 벗과 같은 비화(比和)의 연이로다. 다만 닮은 만큼 부딪힐 때는 한 발씩 물러설지어다.`;
    case '상극':
      return `${nameA}의 ${ea} 기운과 ${nameB}의 ${eb} 기운은 서로 부딪히는 상극(相剋)의 연이나, 두려워 말지어다. 서로를 갈고 단련시키는 인연이니, 다름을 인정하는 순간 그 어떤 연보다 단단해지리라.`;
  }
}

interface AxisResult {
  score: number;
  text: string;
}

function scoreAxis(a: MBTI, b: MBTI): AxisResult[] {
  const results: AxisResult[] = [];

  // S/N: 세상을 보는 눈 — 같으면 가장 큰 가산점
  if (a[1] === b[1]) {
    results.push({ score: 25, text: '두 사람이 세상을 같은 눈으로 바라보니, 대화가 물 흐르듯 통하리라.' });
  } else {
    results.push({ score: 10, text: '한 사람은 눈앞의 현실을, 한 사람은 먼 미래를 보니, 서로의 눈이 되어줄 수 있는 연이로다.' });
  }

  // E/I: 에너지 방향 — 다르면 음양의 조화
  if (a[0] !== b[0]) {
    results.push({ score: 15, text: '한 사람의 밝은 기운과 한 사람의 고요한 기운이 만나 음양의 조화를 이루도다.' });
  } else {
    results.push({ score: 10, text: '두 사람의 기운이 같은 방향으로 흐르니, 함께하는 시간의 결이 잘 맞으리라.' });
  }

  // T/F: 마음을 쓰는 방식
  if (a[2] === b[2]) {
    results.push({ score: 15, text: '마음을 쓰는 방식이 같으니 서로를 오해할 일이 적으리라.' });
  } else {
    results.push({ score: 10, text: '한 사람은 머리로, 한 사람은 가슴으로 세상을 읽으니, 서로에게 없는 반쪽을 채워주는 연이로다.' });
  }

  // J/P: 삶의 속도
  if (a[3] !== b[3]) {
    results.push({ score: 15, text: '한 사람은 계획을 세우고 한 사람은 바람을 따르니, 서로의 삶에 새로움과 안정을 더해주리라.' });
  } else {
    results.push({ score: 10, text: '삶의 속도가 서로 같으니 발걸음을 맞추기 수월하리라.' });
  }

  return results;
}

function getSummary(score: number): string {
  if (score >= 90) return '하늘이 맺어준 천생연분이로다! 별들도 이 인연을 축복하노라. ✨';
  if (score >= 75) return '오래도록 서로를 빛나게 할 좋은 인연이로다. 🌸';
  if (score >= 60) return '노력하는 만큼 깊어지는 인연이니, 서로를 알아가는 재미가 있으리라. 🌱';
  return '서로를 성장시키는 인연이로다. 다름 속에서 배우는 것이 많으리라. ⚒️';
}

export interface CompatibilityResult {
  score: number;
  elementA: Element;
  elementB: Element;
  relation: ElementRelation;
  relationText: string;
  mbtiTexts: string[];
  summary: string;
}

export function calculateCompatibility(a: PersonInput, b: PersonInput): CompatibilityResult {
  const sajuA = calculateSajuWithElements(a.year, a.month, a.day);
  const sajuB = calculateSajuWithElements(b.year, b.month, b.day);

  const elementA = sajuA.dominantElement;
  const elementB = sajuB.dominantElement;
  const relation = getElementRelation(elementA, elementB);

  const axisResults = scoreAxis(a.mbti, b.mbti);
  const score = RELATION_SCORES[relation] + axisResults.reduce((sum, r) => sum + r.score, 0);

  return {
    score,
    elementA,
    elementB,
    relation,
    relationText: getRelationText(a.name, b.name, elementA, elementB, relation),
    mbtiTexts: axisResults.map((r) => r.text),
    summary: getSummary(score),
  };
}
