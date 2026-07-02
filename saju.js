const { calculateSaju, getPillarByHangul } = require('@fullstackfamily/manseryeok');

const ELEMENTS = ['목', '화', '토', '금', '수'];

/**
 * 생년월일시를 입력받아 사주팔자와 오행 분포를 계산한다.
 *
 * @param {number} year 양력 년
 * @param {number} month 양력 월 (1~12)
 * @param {number} day 양력 일 (1~31)
 * @param {number} [hour] 양력 시 (0~23, 모르면 생략)
 * @param {number} [minute=0] 양력 분 (0~59)
 * @param {{ longitude?: number, applyTimeCorrection?: boolean }} [options] 사주 계산 옵션 (경도 등)
 * @returns {{
 *   pillars: { year: string, month: string, day: string, hour: string|null },
 *   pillarsHanja: { year: string, month: string, day: string, hour: string|null },
 *   isTimeCorrected: boolean,
 *   correctedTime: { hour: number, minute: number } | undefined,
 *   elementCounts: Record<'목'|'화'|'토'|'금'|'수', number>,
 *   elementPercentages: Record<'목'|'화'|'토'|'금'|'수', number>,
 *   dominantElement: string,
 * }}
 */
function getSajuWithElements(year, month, day, hour, minute = 0, options) {
  const saju = calculateSaju(year, month, day, hour, minute, options);

  const pillarHanguls = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar].filter(Boolean);

  const elementCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (const hangul of pillarHanguls) {
    const pillar = getPillarByHangul(hangul);
    if (!pillar) continue;
    elementCounts[pillar.tiangan.element] += 1;
    elementCounts[pillar.dizhi.element] += 1;
  }

  const total = pillarHanguls.length * 2;
  const elementPercentages = {};
  for (const element of ELEMENTS) {
    elementPercentages[element] = total > 0 ? Math.round((elementCounts[element] / total) * 1000) / 10 : 0;
  }

  const dominantElement = ELEMENTS.reduce((max, el) => (elementCounts[el] > elementCounts[max] ? el : max), ELEMENTS[0]);

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
  };
}

module.exports = { getSajuWithElements };

if (require.main === module) {
  const result = getSajuWithElements(1990, 5, 15, 14, 30);

  console.log('=== 사주팔자 ===');
  console.log(`년주: ${result.pillars.year} (${result.pillarsHanja.year})`);
  console.log(`월주: ${result.pillars.month} (${result.pillarsHanja.month})`);
  console.log(`일주: ${result.pillars.day} (${result.pillarsHanja.day})`);
  console.log(`시주: ${result.pillars.hour} (${result.pillarsHanja.hour})`);

  console.log('\n=== 오행 분포 ===');
  for (const element of ELEMENTS) {
    console.log(`${element}: ${result.elementCounts[element]}개 (${result.elementPercentages[element]}%)`);
  }
  console.log(`\n가장 강한 오행: ${result.dominantElement}`);
}
