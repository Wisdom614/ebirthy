/**
 * Calendar Reminder Integration for Time-Lock Waiting Experience
 */

export function generateGoogleCalendarUrl(
  recipientName: string,
  unlockIso: string
): string {
  const targetDate = new Date(unlockIso);
  const startDateStr = targetDate
    .toISOString()
    .replace(/-|:|\.\d+/g, '');
  
  // 1-hour event duration
  const endDate = new Date(targetDate.getTime() + 60 * 60 * 1000);
  const endDateStr = endDate
    .toISOString()
    .replace(/-|:|\.\d+/g, '');

  const title = encodeURIComponent(`🎉 Birthday Celebration Dispatch Unlocks for ${recipientName}!`);
  const details = encodeURIComponent(
    `The sealed birthday vault for ${recipientName} has officially unlocked! Return to your celebration dispatch link to open the full experience.`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}`;
}

export function downloadIcsFile(
  recipientName: string,
  unlockIso: string
) {
  const targetDate = new Date(unlockIso);
  const startStr = targetDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endStr = new Date(targetDate.getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d+/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ebirthy//Celebration Dispatch Reminder//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:🎉 Birthday Celebration Unlocks for ${recipientName}`,
    `DESCRIPTION:The sealed birthday vault for ${recipientName} has unlocked!`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `birthday-unlock-${recipientName.toLowerCase().replace(/\s+/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
