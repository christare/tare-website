/**
 * Bookable weekend dates for Studio sessions.
 * Cutoff: Thursday 11pm EST — booking for a given weekend closes at that time.
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

function formatLabel(d: Date, shortDay: 'Sat' | 'Sun'): string {
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  return `${shortDay}, ${month} ${day}`;
}

export type WeekendDateOption = { date: string; label: string; bookable: boolean };

/**
 * Returns the next X upcoming Saturday and Sunday dates.
 * - Past dates (day already happened in EST) are not shown.
 * - Dates for the immediate weekend are greyed out (bookable: false) once Thursday 11pm EST has passed.
 */
export function getBookableWeekendDates(maxDates = 12): WeekendDateOption[] {
  const results: WeekendDateOption[] = [];
  const now = new Date();
  const est = getESTDateParts(now);
  const start = new Date(est.year, est.month - 1, est.day);
  const dayOfWeek = start.getDay();
  // Start from this week's Saturday (may be in the past — we filter those out)
  const daysToThisWeekSaturday = (dayOfWeek + 1) % 7;
  let sat = new Date(start);
  sat.setDate(start.getDate() - daysToThisWeekSaturday);

  for (let w = 0; w < 6 && results.length < maxDates; w++) {
    const satStr = formatYYYYMMDD(sat);
    const thursday = new Date(sat);
    thursday.setDate(sat.getDate() - 2);
    const thursdayStr = formatYYYYMMDD(thursday);
    const cutoff = new Date(thursdayStr + 'T23:00:00-05:00');
    const stillBookable = now < cutoff;

    // Saturday: only include if the day hasn't passed (today in EST <= sat)
    const satEnd = new Date(satStr + 'T23:59:59-05:00');
    if (now <= satEnd) {
      results.push({ date: satStr, label: formatLabel(sat, 'Sat'), bookable: stillBookable });
    }
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    const sunStr = formatYYYYMMDD(sun);
    const sunEnd = new Date(sunStr + 'T23:59:59-05:00');
    if (now <= sunEnd) {
      results.push({ date: sunStr, label: formatLabel(sun, 'Sun'), bookable: stillBookable });
    }

    sat.setDate(sat.getDate() + 7);
  }
  return results;
}
