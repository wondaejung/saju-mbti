// 신선의 부적 뽑기: 생년월일 + 오늘 날짜 시드로 하루 한 장 결정적으로 뽑힌다
import { hashString, getDailyKey } from './fortune';

export interface Talisman {
  emoji: string;
  name: string;
  effect: string;
}

const TALISMANS: Talisman[] = [
  {
    emoji: '🌕',
    name: '보름달 부적',
    effect: '오늘 당신의 소망 하나가 달빛을 타고 하늘에 닿으리라. 마음속 소원을 하나만 조용히 빌어볼지어다.',
  },
  {
    emoji: '🐉',
    name: '청룡 부적',
    effect: '동방의 푸른 용이 당신의 앞길을 여노라. 새로 시작하는 일에 큰 상승의 기운이 함께하리라.',
  },
  {
    emoji: '🐯',
    name: '백호 부적',
    effect: '서방의 흰 호랑이가 당신의 곁을 지키노라. 오늘 하루 나쁜 기운이 감히 다가오지 못하리라.',
  },
  {
    emoji: '🔥',
    name: '주작 부적',
    effect: '남방의 붉은 새가 당신의 열정에 불을 지피노라. 미뤄왔던 일을 오늘 해치우기 좋은 기운이니라.',
  },
  {
    emoji: '🐢',
    name: '현무 부적',
    effect: '북방의 검은 거북이 당신에게 깊은 지혜를 내리노라. 중요한 판단은 오늘 내리는 것이 길하리라.',
  },
  {
    emoji: '🌸',
    name: '도화 부적',
    effect: '복사꽃의 기운이 당신을 감싸니, 오늘 당신의 매력이 평소보다 배로 빛나리라. 만남을 두려워 말지어다.',
  },
  {
    emoji: '💰',
    name: '재물 부적',
    effect: '엽전의 기운이 당신의 주머니에 깃드노라. 뜻밖의 작은 이득이 굴러들어올 수 있으니 눈을 밝게 뜰지어다.',
  },
  {
    emoji: '📜',
    name: '지혜 부적',
    effect: '옛 성현의 두루마리가 당신의 머리를 맑게 하노라. 공부와 문서 일에 특히 좋은 기운이니라.',
  },
  {
    emoji: '⚔️',
    name: '용기 부적',
    effect: '천년 검의 기운이 당신의 등을 밀어주노라. 망설이던 말과 결정을 오늘 꺼내볼지어다.',
  },
  {
    emoji: '🕊️',
    name: '평안 부적',
    effect: '흰 새의 날갯짓이 당신의 마음속 소란을 잠재우노라. 오늘은 스스로에게 너그러워질지어다.',
  },
  {
    emoji: '🍀',
    name: '행운 부적',
    effect: '네 잎의 풀잎이 당신의 걸음마다 깔리노라. 우연을 가장한 좋은 일이 당신을 기다리리라.',
  },
  {
    emoji: '🌊',
    name: '흐름 부적',
    effect: '큰 강의 물결이 당신을 순리로 이끄노라. 오늘은 애쓰지 말고 흐름에 몸을 맡기는 것이 상책이니라.',
  },
  {
    emoji: '⛰️',
    name: '태산 부적',
    effect: '큰 산의 기운이 당신의 중심을 붙잡아주노라. 어떤 흔들림에도 무너지지 않는 하루가 되리라.',
  },
  {
    emoji: '✨',
    name: '별빛 부적',
    effect: '밤하늘 별 하나가 당신의 이름을 기억하노라. 오늘 당신이 건네는 친절이 몇 배의 복으로 돌아오리라.',
  },
];

/** 생년월일 기준으로 오늘의 부적을 뽑는다 (같은 날엔 같은 부적) */
export function getDailyTalisman(year: number, month: number, day: number, now: Date = new Date()): Talisman {
  const seed = hashString(`talisman-${year}-${month}-${day}::${getDailyKey(now)}`);
  return TALISMANS[seed % TALISMANS.length];
}
