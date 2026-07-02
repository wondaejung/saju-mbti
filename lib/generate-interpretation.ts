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
  '이 산의 깊은 안개 속에서 그대의 혼을 마주하니...',
  '천지의 뜻이 그대를 이렇게 형성하였노라...',
  '별들의 목소리로 들으니 그대의 운명은...',
  '천년 묵은 바위가 전하는 그대의 이야기는...',
];

const MYSTICAL_TRANSITIONS = [
  '그 위에 하늘이 또 다른 선물을 내리니...',
  '그러하여 우주의 기운은 그대에게...',
  '이 대우주의 흐름 속에서 그대는...',
  '밤하늘의 별들이 속삭이듯이...',
  '산신의 미소로 보건대...',
  '세월의 강물도 그대의 길을 따라...',
];

const MYSTICAL_CLOSINGS = [
  '이것이 그대의 숨겨진 운명의 진실이리라.',
  '천지가 그대에게 내린 은총의 자취이노다.',
  '그대는 이 우주의 거대한 선물을 품고 살아가리니.',
  '별들이 그대를 바라보며 속삭이노라.',
  '이 진리가 그대의 마음에 스며들기를 바라노라.',
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

function toMysticalTone(text: string): string {
  return text
    .replace(/뭔가 특별/g, '운명의 기운')
    .replace(/있어요\./g, '도다.')
    .replace(/있어요/g, '도다')
    .replace(/돋보여요/g, '드러나도다')
    .replace(/두드러지네요/g, '두드러지도다')
    .replace(/두드러지고 있네요/g, '두드러지도다')
    .replace(/에요\./g, '이로다.')
    .replace(/에요/g, '이로다')
    .replace(/네요\./g, '도다.')
    .replace(/네요/g, '도다')
    .replace(/돼요/g, '되도다')
    .replace(/생겨요/g, '생기도다')
    .replace(/수 있어요/g, '수 있으리니')
    .replace(/할 수 있어요/g, '할 수 있으리니')
    .replace(/됩니다/g, '되느니라');
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
