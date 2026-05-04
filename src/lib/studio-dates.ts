/**
 * Bookable Saturday session dates for Studio.
 * Cutoff: Thursday 11pm Eastern · booking for that Saturday closes at that time.
 */

function getESTDateParts(now: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find((p) => p.type === 'year')!.value, 10);
  const month = parseInt(parts.find((p) => p.type === 'month')!.value, 10);
  const day = parseInt(parts.find((p) => p.type === 'day')!.value, 10);
  return { year, month, day };
}

function formatYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatSaturdayLabel(d: Date): string {
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  return `Sat, ${month} ${day}`;
}

export type StudioDateOption = { date: string; label: string; bookable: boolean };

/**
 * Returns the next X upcoming Saturday session dates.
 * - Past Saturdays (day already ended in Eastern) are not shown.
 * - The upcoming Saturday is greyed out (bookable: false) once Thursday 11pm Eastern before it has passed.
 */
export function getBookableSaturdayDates(maxDates = 12): StudioDateOption[] {
  const results: StudioDateOption[] = [];
  const now = new Date();
  const est = getESTDateParts(now);
  const start = new Date(est.year, est.month - 1, est.day);
  const dayOfWeek = start.getDay();
  // This week's Saturday (may be in the past · we filter below)
  const daysToThisWeekSaturday = (dayOfWeek + 1) % 7;
  let sat = new Date(start);
  sat.setDate(start.getDate() - daysToThisWeekSaturday);

  for (let w = 0; w < 24 && results.length < maxDates; w++) {
    const satStr = formatYYYYMMDD(sat);
    const thursday = new Date(sat);
    thursday.setDate(sat.getDate() - 2);
    const thursdayStr = formatYYYYMMDD(thursday);
    const cutoff = new Date(thursdayStr + 'T23:00:00-05:00');
    const stillBookable = now < cutoff;

    const satEnd = new Date(satStr + 'T23:59:59-05:00');
    if (now <= satEnd) {
      results.push({ date: satStr, label: formatSaturdayLabel(sat), bookable: stillBookable });
    }

    sat.setDate(sat.getDate() + 7);
  }
  return results;
}
