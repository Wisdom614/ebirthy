export interface LifeChronicle {
  totalYears: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isTodayBirthday: boolean;
  isValid: boolean;
}

/**
 * Calculates live life duration telemetry from a given birth date string.
 * Computes exact cumulative totals: Total Years, Total Months, Total Weeks,
 * Total Days, Total Hours, Total Minutes, and Total Seconds.
 */
export function calculateLifeChronicle(birthDateStr?: string, targetNow?: Date): LifeChronicle {
  const invalidResult: LifeChronicle = {
    totalYears: 0,
    totalMonths: 0,
    totalWeeks: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    isTodayBirthday: false,
    isValid: false
  };

  if (!birthDateStr) return invalidResult;

  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return invalidResult;

  const now = targetNow || new Date();
  const diffMs = now.getTime() - birth.getTime();

  if (diffMs <= 0) return invalidResult;

  // 1. Total Completed Years
  let totalYears = now.getFullYear() - birth.getFullYear();
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) {
    totalYears--;
  }
  totalYears = Math.max(0, totalYears);

  // 2. Total Completed Months
  let totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) {
    totalMonths--;
  }
  totalMonths = Math.max(0, totalMonths);

  // 3. Total Weeks
  const totalWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  // 4. Total Days
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 5. Total Hours
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

  // 6. Total Minutes
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  // 7. Total Seconds
  const totalSeconds = Math.floor(diffMs / 1000);

  const isTodayBirthday =
    now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate();

  return {
    totalYears,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    isTodayBirthday,
    isValid: true
  };
}
