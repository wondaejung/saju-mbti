// 일일/주간 운세 생성 (십이지신 띠 + 서양 별자리)
// API 호출 없이 날짜 기반 시드로 결정적으로 생성 (같은 날엔 같은 운세)

export interface AnimalInfo {
  name: string;
  emoji: string;
}

export interface StarInfo {
  name: string;
  symbol: string;
}

// year % 12 === 0 → 원숭이 (예: 2016 원숭이, 2020 쥐, 1990 말)
const ANIMALS: AnimalInfo[] = [
  { name: '원숭이', emoji: '🐵' },
  { name: '닭', emoji: '🐔' },
  { name: '개', emoji: '🐶' },
  { name: '돼지', emoji: '🐷' },
  { name: '쥐', emoji: '🐭' },
  { name: '소', emoji: '🐮' },
  { name: '호랑이', emoji: '🐯' },
  { name: '토끼', emoji: '🐰' },
  { name: '용', emoji: '🐲' },
  { name: '뱀', emoji: '🐍' },
  { name: '말', emoji: '🐴' },
  { name: '양', emoji: '🐑' },
];

export function getZodiacAnimal(year: number): AnimalInfo {
  return ANIMALS[((year % 12) + 12) % 12];
}

const STAR_SIGNS: { name: string; symbol: string; from: [number, number]; to: [number, number] }[] = [
  { name: '물병자리', symbol: '♒', from: [1, 20], to: [2, 18] },
  { name: '물고기자리', symbol: '♓', from: [2, 19], to: [3, 20] },
  { name: '양자리', symbol: '♈', from: [3, 21], to: [4, 19] },
  { name: '황소자리', symbol: '♉', from: [4, 20], to: [5, 20] },
  { name: '쌍둥이자리', symbol: '♊', from: [5, 21], to: [6, 21] },
  { name: '게자리', symbol: '♋', from: [6, 22], to: [7, 22] },
  { name: '사자자리', symbol: '♌', from: [7, 23], to: [8, 22] },
  { name: '처녀자리', symbol: '♍', from: [8, 23], to: [9, 23] },
  { name: '천칭자리', symbol: '♎', from: [9, 24], to: [10, 22] },
  { name: '전갈자리', symbol: '♏', from: [10, 23], to: [11, 22] },
  { name: '사수자리', symbol: '♐', from: [11, 23], to: [12, 24] },
  { name: '염소자리', symbol: '♑', from: [12, 25], to: [1, 19] },
];

export function getStarSign(month: number, day: number): StarInfo {
  for (const sign of STAR_SIGNS) {
    const [fm, fd] = sign.from;
    const [tm, td] = sign.to;
    if (fm === tm) {
      if (month === fm && day >= fd && day <= td) return sign;
    } else {
      // 연말~연초에 걸치는 염소자리 포함
      if ((month === fm && day >= fd) || (month === tm && day <= td)) return sign;
    }
  }
  return STAR_SIGNS[0];
}

// ===== 운세 문구 풀 (신선 말투) =====

const DAILY_ANIMAL_FORTUNES = [
  '오늘 천지의 기운이 당신의 띠를 향해 순하게 흐르니, 걸음마다 작은 복이 깃들리라. 망설이던 일이 있다면 해가 높을 때 움직일지어다.',
  '해가 뜨는 방향에서 귀인이 다가오는 형상이로다. 오늘 처음 마주치는 인연을 소홀히 대하지 말지어다.',
  '재물의 문이 반쯤 열려 있으니, 큰 욕심은 화를 부르나 성실한 손길에는 복이 따르리라.',
  '오늘은 물이 바위를 돌아가듯 순리를 따르는 것이 상책이니라. 다투지 말고 한 발 물러서면 오히려 크게 얻으리라.',
  '묵은 기운이 걷히고 새 바람이 부는 날이로다. 미뤄두었던 일을 오늘 시작하면 하늘이 도우리라.',
  '작은 오해가 생기기 쉬운 날이니, 말은 아끼고 귀는 열어둘지어다. 침묵이 금보다 귀하리라.',
  '몸의 기운이 평소보다 낮게 흐르니 무리하지 말지어다. 따뜻한 차 한 잔이 보약이 되는 날이로다.',
  '뜻밖의 소식이 문을 두드리는 형상이로다. 놀라지 말고 차분히 맞이하면 길한 일로 바뀌리라.',
  '오늘의 수고는 헛되지 않으니, 씨앗을 뿌리는 마음으로 임할지어다. 열매는 머지않아 맺히리라.',
  '달빛이 당신의 길을 비추니, 저녁 무렵의 약속이나 만남에 특히 좋은 기운이 감돌리라.',
];

const DAILY_STAR_FORTUNES = [
  '별들의 배열이 당신의 직감을 밝히니, 오늘은 머리보다 가슴이 이끄는 쪽을 믿을지어다.',
  '수성의 기운이 맑게 흐르니 말과 글에 힘이 실리는 날이로다. 미뤄둔 연락을 오늘 전할지어다.',
  '금성이 부드럽게 빛나니 인연의 기운이 무르익도다. 마음에 둔 이가 있다면 오늘 미소를 아끼지 말지어다.',
  '화성의 기운이 다소 거치니 급한 결정은 하루만 미룰지어다. 내일의 눈이 더 밝으리라.',
  '목성이 재물의 방을 비추니 작은 행운이 지갑 근처를 맴도는 날이로다.',
  '토성이 당신의 어깨를 지그시 누르나, 이는 시련이 아니라 단련이니 묵묵히 걸어갈지어다.',
  '보름의 기운이 감정을 크게 일렁이게 하니, 오늘의 서운함은 내일이면 안개처럼 걷히리라.',
  '별똥별 하나가 당신의 궁을 스치니, 우연처럼 보이는 기회가 실은 운명일지니 놓치지 말지어다.',
  '하늘의 별들이 고요히 정렬하니 집중력이 빛나는 날이로다. 어려운 일일수록 오전에 끝낼지어다.',
  '달과 별이 서로 화답하니 오래된 벗에게서 반가운 기운이 전해지리라.',
];

const WEEKLY_ANIMAL_FORTUNES = [
  '이번 이레는 씨를 뿌리는 주간이니, 눈앞의 성과보다 바탕을 다지는 데 힘쓸지어다. 주 후반에 귀인의 손길이 닿으리라.',
  '주 초반에는 구름이 끼나 주 중반부터 해가 드는 형상이로다. 사흘이 지난 후에 중요한 일을 도모할지어다.',
  '재물운이 서서히 차오르는 주간이니, 다만 빌려주는 돈은 돌아오지 않는 형상이니 삼갈지어다.',
  '인연의 실이 얽히기 쉬운 주간이로다. 오해는 그날에 풀고 해를 넘기지 말지어다.',
  '이번 이레는 건강의 기운을 먼저 살필지어다. 몸이 보내는 작은 신호를 무시하면 큰 소리로 돌아오리라.',
  '막혔던 물길이 트이는 주간이니, 오래 기다리던 소식이 당도하리라. 기쁨은 나눌수록 배가 되느니라.',
  '경쟁의 기운이 감도는 주간이나 두려워 말지어다. 당신의 자리는 흔들리지 않으리라.',
  '이번 이레는 비움의 지혜가 필요하도다. 하나를 내려놓으면 둘이 들어오는 형상이니라.',
];

const WEEKLY_STAR_FORTUNES = [
  '이번 주 별자리의 수호성이 밝게 빛나니, 스스로를 믿는 만큼 길이 열리리라.',
  '주중에 수성의 장난이 있으니 문서와 약속은 두 번 확인할지어다.',
  '금성의 기운이 주말에 절정에 이르니, 사람과의 만남은 주말로 미루는 것이 길하리라.',
  '이번 주는 달의 기운이 감성을 깊게 하니, 예술과 기록에 마음을 쏟으면 큰 위로를 얻으리라.',
  '목성의 축복이 배움의 방에 머무니, 새로 시작하는 공부에 하늘의 순풍이 불리라.',
  '토성이 인내를 시험하는 주간이나, 이 고비를 넘기면 한 뼘 자란 자신을 만나리라.',
  '별들이 재물의 궁에 모여드니, 계획했던 지출은 길하나 충동은 흉하니라.',
  '이번 주 하늘은 휴식을 권하노라. 바쁜 걸음을 잠시 멈추면 놓쳤던 풍경이 보이리라.',
];

const LUCKY_COLORS = ['자줏빛', '쪽빛', '금빛', '비취빛', '달빛 은색', '주홍빛', '연둣빛', '먹빛'];
const LUCKY_ITEMS = ['붓', '옥구슬', '엽전', '매듭 팔찌', '손거울', '작은 방울', '비단 손수건', '책 한 권', '따뜻한 차', '흰 돌멩이'];
const WEEKLY_KEYWORDS = ['인내', '도약', '인연', '비움', '결실', '정진', '휴식', '용기'];

// ===== 시드 기반 결정적 선택 =====

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt * 7919) % arr.length];
}

function getDailyKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getWeeklyKey(d: Date): string {
  // 이번 주 월요일 날짜를 키로 사용 → 같은 주엔 같은 운세
  const monday = new Date(d);
  const offset = (d.getDay() + 6) % 7;
  monday.setDate(d.getDate() - offset);
  return `week-${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
}

export interface Fortune {
  animal: AnimalInfo;
  star: StarInfo;
  daily: {
    animalText: string;
    starText: string;
    luckyColor: string;
    luckyNumber: number;
    luckyItem: string;
    score: number; // 3~5
  };
  weekly: {
    animalText: string;
    starText: string;
    keyword: string;
    score: number; // 3~5
  };
}

export function getFortune(year: number, month: number, day: number, now: Date = new Date()): Fortune {
  const animal = getZodiacAnimal(year);
  const star = getStarSign(month, day);

  const dailyKey = getDailyKey(now);
  const weeklyKey = getWeeklyKey(now);

  // 같은 띠는 같은 띠 운세, 같은 별자리는 같은 별자리 운세를 공유 (진짜 운세처럼)
  const dAnimalSeed = hashString(`${animal.name}-${dailyKey}`);
  const dStarSeed = hashString(`${star.name}-${dailyKey}`);
  const dLuckySeed = hashString(`${animal.name}-${star.name}-${dailyKey}`);
  const wAnimalSeed = hashString(`${animal.name}-${weeklyKey}`);
  const wStarSeed = hashString(`${star.name}-${weeklyKey}`);

  return {
    animal,
    star,
    daily: {
      animalText: pick(DAILY_ANIMAL_FORTUNES, dAnimalSeed, 1),
      starText: pick(DAILY_STAR_FORTUNES, dStarSeed, 2),
      luckyColor: pick(LUCKY_COLORS, dLuckySeed, 3),
      luckyNumber: (dLuckySeed % 9) + 1,
      luckyItem: pick(LUCKY_ITEMS, dLuckySeed, 4),
      score: 3 + (dLuckySeed % 3),
    },
    weekly: {
      animalText: pick(WEEKLY_ANIMAL_FORTUNES, wAnimalSeed, 1),
      starText: pick(WEEKLY_STAR_FORTUNES, wStarSeed, 2),
      keyword: pick(WEEKLY_KEYWORDS, wAnimalSeed, 5),
      score: 3 + (wAnimalSeed % 3),
    },
  };
}
