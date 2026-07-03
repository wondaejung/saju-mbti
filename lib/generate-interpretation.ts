import type { Tiangan, Sipseong, Wangsang } from './saju-analysis';
import { YILGAN_DESCRIPTIONS, ELEMENT_WANGSANG, SIPSEONG_DESCRIPTIONS, MBTI_SIPSEONG_SYNERGY, getRandomConnector } from './interpretation-layers';
import type { MBTI } from './interpretations';

export interface InterpretationComponents {
  yilgan: Tiangan;
  mainElement: string;
  mainWangsang: Wangsang;
  mainSipseong: Sipseong;
  mbti: MBTI;
  month: number;
}

function getMBTIAxes(mbti: MBTI): Record<string, string> {
  const axes: Record<string, string> = {};
  axes['EI'] = mbti[0] === 'E' ? 'E' : 'I';
  axes['SN'] = mbti[1] === 'S' ? 'S' : 'N';
  axes['TF'] = mbti[2] === 'T' ? 'T' : 'F';
  axes['JP'] = mbti[3] === 'J' ? 'J' : 'P';
  return axes;
}

function getSipseongCategory(sipseong: Sipseong): string {
  if (sipseong === '비견' || sipseong === '겁재') return '비겁';
  if (sipseong === '식신' || sipseong === '상관') return '식상';
  if (sipseong === '편재' || sipseong === '정재') return '재성';
  if (sipseong === '편관' || sipseong === '관성') return '관살';
  if (sipseong === '편인' || sipseong === '인성') return '인성';
  return '비겁';
}

function findSynergyKey(mbtiAxis: string, sipseongCategory: string): string {
  const keys = Object.keys(MBTI_SIPSEONG_SYNERGY);
  const possibleKeys = keys.filter((k) => k.includes(mbtiAxis) && k.includes(sipseongCategory));

  if (possibleKeys.length > 0) {
    return possibleKeys[0];
  }

  // 두 자리 축 (E/I, S/N, T/F, J/P)별로 시너지 찾기
  const axisKeys = keys.filter((k) => k.startsWith(mbtiAxis));
  if (axisKeys.length > 0) {
    return axisKeys[Math.floor(Math.random() * axisKeys.length)];
  }

  return '';
}

const MYSTICAL_OPENINGS = [
  '이 산의 깊은 안개 속에서 당신의 혼을 마주하니...',
  '천지의 뜻이 당신을 이렇게 빚어내었노라...',
  '별들의 목소리로 들으니 당신의 운명은...',
  '천년 묵은 바위가 전하는 당신의 이야기는...',
];

const MYSTICAL_TRANSITIONS = [
  '그 위에 하늘이 또 다른 선물을 내리니...',
  '그러하매 우주의 기운은 당신에게 이르노니...',
  '이 대우주의 흐름 속에서 보건대...',
  '밤하늘의 별들이 속삭이듯이...',
  '산신의 미소로 보건대...',
  '세월의 강물도 당신의 길을 따라 흐르노니...',
];

const MYSTICAL_CLOSINGS = [
  '이것이 당신의 숨겨진 운명의 진실이리라.',
  '천지가 당신에게 내린 은총의 자취이노라.',
  '당신은 이 우주의 거대한 선물을 품고 살아가리니.',
  '별들이 당신을 바라보며 속삭이노라.',
  '이 진리가 당신의 마음에 스며들기를 바라노라.',
];

function getRandomMysticalOpening(): string {
  return MYSTICAL_OPENINGS[Math.floor(Math.random() * MYSTICAL_OPENINGS.length)];
}

function getRandomMysticalTransition(): string {
  return MYSTICAL_TRANSITIONS[Math.floor(Math.random() * MYSTICAL_TRANSITIONS.length)];
}

function getRandomMysticalClosing(): string {
  return MYSTICAL_CLOSINGS[Math.floor(Math.random() * MYSTICAL_CLOSINGS.length)];
}

// 존댓말(~요체)을 신선의 고어체로 변환하는 규칙들
// 순서가 중요: 긴 패턴을 먼저 처리하고, 마지막에 남은 '~요'를 일괄 정리
const MYSTICAL_RULES: [RegExp, string][] = [
  [/뭔가 특별/g, '운명의 기운'],
  // 합쇼체
  [/입니다/g, '이니라'],
  [/됩니다/g, '되느니라'],
  [/합니다/g, '하느니라'],
  // 지시/권유형
  [/하세요/g, '할지어다'],
  [/보세요/g, '볼지어다'],
  [/마세요/g, '말지어다'],
  [/조심하세요/g, '조심할지어다'],
  [/세요/g, '할지어다'],
  [/알아둬요/g, '알아둘지어다'],
  [/둬요/g, '둘지어다'],
  [/줘요/g, '줄지어다'],
  // 자주 나오는 서술형 (구체적인 것부터)
  [/거죠/g, '것이니라'],
  [/거예요/g, '것이니라'],
  [/죠/g, '지 않겠는가'],
  [/이에요/g, '이니라'],
  [/예요/g, '이니라'],
  [/에요/g, '이니라'],
  [/않아요/g, '아니하노라'],
  [/있어요/g, '있느니라'],
  [/없어요/g, '없느니라'],
  [/해요/g, '하느니라'],
  [/돼요/g, '되느니라'],
  [/되어요/g, '되느니라'],
  [/봐요/g, '보느니라'],
  [/나와요/g, '나오느니라'],
  [/와요/g, '오느니라'],
  [/같아요/g, '같으니라'],
  [/달라요/g, '다르도다'],
  [/뛰어나요/g, '뛰어나도다'],
  [/생겨요/g, '생기느니라'],
  [/커져요/g, '커지느니라'],
  [/져요/g, '지느니라'],
  [/쳐요/g, '치느니라'],
  [/여요/g, '이느니라'],
  [/네요/g, '도다'],
  [/나요/g, '나도다'],
  [/아요/g, '도다'],
  [/어요/g, '도다'],
  // 최후의 보루: 남아있는 모든 '~요' 어미를 고어체로
  [/([가-힣])요(?=[\s.,!?~)"'』]|$)/g, '$1노라'],
];

function toMysticalTone(text: string): string {
  let result = text;
  for (const [pattern, replacement] of MYSTICAL_RULES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function generateFullInterpretation(components: InterpretationComponents): string {
  const { yilgan, mainElement, mainWangsang, mainSipseong, mbti, month } = components;

  const parts: string[] = [];

  // 신비로운 오프닝
  parts.push(getRandomMysticalOpening());

  // 레이어 ①: 일간 기본 성향
  let yilganDesc = YILGAN_DESCRIPTIONS[yilgan];
  if (yilganDesc) {
    yilganDesc = toMysticalTone(yilganDesc);
    parts.push(yilganDesc);
  }

  // 레이어 ②: 오행 강약 보완
  let elementWangsangDesc = ELEMENT_WANGSANG[mainElement]?.[mainWangsang];
  if (elementWangsangDesc) {
    elementWangsangDesc = toMysticalTone(elementWangsangDesc);
    parts.push(`${getRandomMysticalTransition()} ${elementWangsangDesc}`);
  }

  // 레이어 ③: 십성 우세 성향
  let sipseongDesc = SIPSEONG_DESCRIPTIONS[mainSipseong];
  if (sipseongDesc) {
    sipseongDesc = toMysticalTone(sipseongDesc);
    parts.push(`${getRandomMysticalTransition()} ${sipseongDesc}`);
  }

  // 레이어 ④: MBTI 4축 x 십성/오행 시너지
  const mbtiAxes = getMBTIAxes(mbti);
  const sipseongCategory = getSipseongCategory(mainSipseong);

  // EI 축 시너지 찾기
  let synergyKey = findSynergyKey(mbtiAxes['EI'], sipseongCategory);
  if (synergyKey && MBTI_SIPSEONG_SYNERGY[synergyKey]) {
    let synergy = toMysticalTone(MBTI_SIPSEONG_SYNERGY[synergyKey]);
    parts.push(`${getRandomMysticalTransition()} ${synergy}`);
  }

  // TF 축 시너지 찾기
  synergyKey = findSynergyKey(mbtiAxes['TF'], sipseongCategory);
  if (synergyKey && MBTI_SIPSEONG_SYNERGY[synergyKey]) {
    let synergy = toMysticalTone(MBTI_SIPSEONG_SYNERGY[synergyKey]);
    parts.push(`${getRandomMysticalTransition()} ${synergy}`);
  }

  // JP 축 시너지 찾기 (마지막 문장)
  synergyKey = findSynergyKey(mbtiAxes['JP'], mainElement);
  if (synergyKey && MBTI_SIPSEONG_SYNERGY[synergyKey]) {
    let synergy = toMysticalTone(MBTI_SIPSEONG_SYNERGY[synergyKey]);
    parts.push(`${getRandomMysticalTransition()} ${synergy}`);
  }

  // 신비로운 결말
  parts.push(`${getRandomMysticalClosing()} ✨`);

  return parts.join(' ');
}

export function generateCompactInterpretation(components: InterpretationComponents): string {
  const { yilgan, mainElement, mainWangsang, mainSipseong, mbti } = components;

  const yilganDesc = YILGAN_DESCRIPTIONS[yilgan];
  const elementWangsangDesc = ELEMENT_WANGSANG[mainElement]?.[mainWangsang];
  const sipseongDesc = SIPSEONG_DESCRIPTIONS[mainSipseong];

  let result = yilganDesc || '';

  if (elementWangsangDesc) {
    result += ` ${getRandomConnector()} ${elementWangsangDesc}`;
  }

  if (sipseongDesc) {
    result += ` ${getRandomConnector()} ${sipseongDesc}`;
  }

  result += ` ${getRandomConnector()} 당신의 ${mainElement}과 ${mbti}가 만나 독특한 개성을 가진 사람이 되었어요! 🌟`;

  return result;
}
