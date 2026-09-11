/**
 * Formats birthdate into DD|MM format (e.g. 13th May -> "13|05")
 */
export const formatBirthDayMonth = (dateStr?: string): string => {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (trimmed.includes('|')) return trimmed;

  // Handle ISO / YYYY-MM-DD format from <input type="date">
  const parts = trimmed.split(/[-/.]/);
  if (parts.length === 3) {
    // [YYYY, MM, DD]
    const [, mm, dd] = parts;
    return `${dd.padStart(2, '0')}|${mm.padStart(2, '0')}`;
  } else if (parts.length === 2) {
    // [MM, DD]
    const [mm, dd] = parts;
    return `${dd.padStart(2, '0')}|${mm.padStart(2, '0')}`;
  }
  
  // Try JS Date parse
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}|${mm}`;
    }
  } catch {}

  return dateStr;
};
