'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FadeLeft } from '@/components/ui/animations/fade';
import { formatCurrency, getPercentageChangeText } from '@/lib/text-formatter';
import { Total } from '@/models/total';
import AnimatedNumber from 'animated-number-react';
import {
  getTotalForDate,
  getPreviousYearTotal,
  calculatePercentageDiff,
} from './calculators';

interface SummaryCardProps {
  title: string;
  amount?: number;
  contentSubText?: string;
}

export function AnimateNumber({
  amount,
  formatter,
}: {
  amount: number | null | undefined;
  formatter: (amount: number) => string;
}) {
  if (amount === null || amount === undefined) return null;

  return <AnimatedNumber value={amount} formatValue={formatter} />;
}

function SummaryCard({ title, amount, contentSubText }: SummaryCardProps) {
  return (
    <Card className="rounded-xl text-center md:p-4 overflow-y-scroll no-scrollbar">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm w-full text-center font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:p-4">
        <div className="text-xl md:text-2xl font-bold">
          <AnimateNumber amount={amount} formatter={formatCurrency} />
        </div>
        <div className="text-xs font-light text-muted-foreground">
          {contentSubText}
        </div>
      </CardContent>
    </Card>
  );
}

SummaryCard.defaultProps = {
  amount: null,
  contentSubText: '',
};

export function Summary({
  totalAmount,
  partialTotal,
  totalsPerYear,
  selectedYear,
  selectedMonth,
  ...props
}: {
  totalAmount: number;
  partialTotal: number;
  totalsPerYear: Total[];
  selectedYear: string;
  selectedMonth?: string;
}) {
  const currentDate = new Date();
  const lastYearCurrentMonth = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth()
  );

  const selectedThisYear =
    parseInt(selectedYear, 10) === currentDate.getFullYear();

  const selectedMonthNumber =
    selectedMonth === '' || selectedMonth === 'All Months'
      ? 0
      : new Date(Date.parse(`${selectedMonth} 1, 2012`)).getMonth() + 1;

  const previousYearTotal = selectedThisYear
    ? getTotalForDate(totalsPerYear, lastYearCurrentMonth, selectedMonthNumber)
    : getPreviousYearTotal(totalsPerYear, selectedYear, selectedMonthNumber);

  const change = calculatePercentageDiff(totalAmount, previousYearTotal);
  const changePercentage = getPercentageChangeText(
    change,
    selectedThisYear,
    lastYearCurrentMonth,
    selectedMonth ?? 'All Months'
  );

  return (
    totalAmount > 0 && (
      <Tabs
        defaultValue="overview"
        className="space-y-4 animate-fade"
        {...props}
      >
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <FadeLeft>
            <div className="flex gap-3 flex-row sm:gap-3 grow mt-2 sm:mt-0">
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard
                  title="Total"
                  amount={totalAmount}
                  contentSubText={changePercentage}
                />
              </div>
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard title="Partial Total" amount={partialTotal} />
              </div>
            </div>
          </FadeLeft>
        </TabsContent>
      </Tabs>
    )
  );
}

Summary.defaultProps = {
  selectedMonth: 'All Months',
};

export default Summary;
