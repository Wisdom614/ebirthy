export interface LifeChronicle {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  isTodayBirthday: boolean;
  isValid: boolean;
}

/**
 * Calculates live life duration telemetry from a given birth date string.
 */
export function calculateLifeChronicle(birthDateStr?: string, targetNow?: Date): LifeChronicle {
  const invalidResult: LifeChronicle = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    isTodayBirthday: false,
    isValid: false
  };

  if (!birthDateStr) return invalidResult;

  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return invalidResult;

  const now = targetNow || new Date();
  const diffMs = now.getTime() - birth.getTime();

  if (diffMs <= 0) return invalidResult;

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  let hours = now.getHours() - birth.getHours();
  let minutes = now.getMinutes() - birth.getMinutes();
  let seconds = now.getSeconds() - birth.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  const isTodayBirthday =
    now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate();

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    weeks: Math.max(0, weeks),
    days: Math.max(0, remainingDays),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    totalDays,
    totalHours,
    totalMinutes,
    isTodayBirthday,
    isValid: true
  };
}
