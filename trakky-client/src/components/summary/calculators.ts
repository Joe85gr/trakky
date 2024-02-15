import { Total } from '@/models/total';

export function calculatePercentageDiff(current: number, previous: number) {
  if (previous === undefined || previous === 0) {
    return 0;
  }

  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

export function getTotalForDate(totals: Total[], untilDate: Date) {
  return totals
    .filter((total) => {
      if (total.date) {
        const date = new Date(total.date);
        return (
          date <= untilDate && date.getFullYear() === untilDate.getFullYear()
        );
      }
      return false;
    })
    .map((total) => total.amount)
    .reduce((total, currentAmount) => total + currentAmount, 0);
}

export function getPreviousYearTotal(
  totalsPerYear: Total[],
  selectedYear: string
) {
  return totalsPerYear
    .filter((total) => {
      if (total.date) {
        const totalDate = new Date(total.date);
        return totalDate.getFullYear() === Number(selectedYear) - 1;
      }
      return false;
    })
    .map((total) => total.amount)
    .reduce((total, currentAmount) => total + currentAmount, 0);
}
