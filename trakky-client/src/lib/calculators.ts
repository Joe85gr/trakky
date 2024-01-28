import { Total } from "@/components/ui/summary.tsx";


export function calculateChangePercentage(current: number, previous: number) {
  if (previous === undefined || previous === 0) {
    return 0;
  }

  return Math.round(
    ((current - previous) /
      previous) *
    100 *
    100,
  ) / 100;
}

export function getYearPartialTotal(
  totalsPerYear: Total[],
  date: Date,
) {
  return totalsPerYear.filter((total) => {
    if (total.date) {
      const totalDate = new Date(total.date);
      return totalDate <= date && totalDate.getFullYear() === date.getFullYear();
    }
    return false;
  }).map((total) => total.amount).reduce((total, currentAmount) => total + currentAmount, 0)
}

export function getPreviousYearTotal(
  totalsPerYear: Total[],
  selectedYear: string,
) {
  return totalsPerYear.filter((total) => {
    if (total.date) {
      const totalDate = new Date(total.date);
      return totalDate.getFullYear() === Number(selectedYear) - 1;
    }
    return false;
  }).map((total) => total.amount).reduce((total, currentAmount) => total + currentAmount, 0)
}