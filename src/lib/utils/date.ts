// Utility function to get today's date in YYYY-MM-DD format using Rome timezone
export function getTodayInRomeTimezone(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/Rome'
  });
}