export const DAYS_OF_WEEK = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье',
} as const;

export function validateWeekdays(weekdays: string): string | null {
  if (!weekdays) return null;
  
  const days = weekdays.split(',').map(day => day.trim());
  
  if (days.length > 2) {
    return 'Можно указать не более двух дней.';
  }

  for (const day of days) {
    if (!Object.keys(DAYS_OF_WEEK).includes(day)) {
      return `Неверный день недели: ${day}. Допустимые: ${Object.keys(DAYS_OF_WEEK).join(', ')}.`;
    }
  }

  return null;
}

export function validateTimeRange(startTime: Date, endTime: Date): string | null {
  if (startTime >= endTime) {
    return 'Начало события должно быть раньше конца.';
  }
  return null;
}

export function calculateAge(dateOfBirth: Date): string {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  if (11 <= age % 100 && age % 100 <= 19) {
    return `${age} лет`;
  }

  const lastDigit = age % 10;
  if (lastDigit === 1) {
    return `${age} год`;
  } else if (2 <= lastDigit && lastDigit <= 4) {
    return `${age} года`;
  } else {
    return `${age} лет`;
  }
} 