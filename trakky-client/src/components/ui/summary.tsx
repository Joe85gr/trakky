'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from '@tanstack/react-table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FadeLeft } from '@/components/animations/fade';
import React from 'react';
import {
  calculateChange,
  getPreviousYearTotal,
  getPreviousYearPartialTotal,
} from '@/lib/calculators';
import { getPercentageChangeText } from '@/lib/formatter';
import { Total } from '@/models/total';

interface SummaryCardProps {
  title: string;
  contentText?: string;
  contentSubText?: string;
  children?: React.ReactNode;
}

function SummaryCard({
  title,
  contentText,
  contentSubText,
  children,
}: SummaryCardProps) {
  return (
    <Card className="border rounded-xl p-1 md:p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:p-4">
        <div className="text-xl md:text-2xl font-bold">{contentText}</div>
        <div className="text-xs text-muted-foreground">
          {contentSubText}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

SummaryCard.defaultProps = {
  contentText: '',
  contentSubText: '',
  children: null,
};

function formatCurrency(total: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(total);
}

type OwnerBalance = {
  owner: string;
  amount: number;
  difference?: string;
};

export function Summary<TData>({
  table,
  totalsPerYear,
  selectedYear,
}: {
  table: Table<TData>;
  totalsPerYear: Total[];
  selectedYear: string;
}) {
  const totalAmounts: number[] = table
    .getPreFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue('amount')));

  const totalAmount = totalAmounts.reduce(
    (total, currentAmount) => total + currentAmount,
    0
  );

  const partialTotal: number = table
    .getFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue('amount')))
    .reduce((total, currentAmount) => total + currentAmount, 0);

  const currentDate = new Date();
  const lastYearCurrentMonth = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth()
  ); // Calculate last year's current month
  const selectedThisYear =
    parseInt(selectedYear, 10) === currentDate.getFullYear();

  const previousYearTotal = selectedThisYear
    ? getPreviousYearPartialTotal(totalsPerYear, lastYearCurrentMonth)
    : getPreviousYearTotal(totalsPerYear, selectedYear);

  const change = calculateChange(totalAmount, previousYearTotal);
  const changePercentage = getPercentageChangeText(
    change,
    selectedThisYear,
    selectedYear,
    lastYearCurrentMonth
  );

  const ownerBalances: OwnerBalance[] = [];

  table
    .getFilteredRowModel()
    .rows.map((r) => ({
      amount: parseFloat(r.getValue('amount')),
      owner: r.getValue('owner'),
    }))
    .forEach((item) => {
      const existingOwnerBalance = ownerBalances.find(
        (balance) => balance.owner === item.owner
      );
      if (existingOwnerBalance) {
        existingOwnerBalance.amount += item.amount;
      } else {
        ownerBalances.push({
          owner: item.owner as string,
          amount: item.amount,
          difference:
            partialTotal / ownerBalances.length - item.amount <= 0.1
              ? ''
              : `(-${formatCurrency(
                  partialTotal / ownerBalances.length - item.amount
                )})`,
        });
      }
    });

  return (
    totalAmount > 0 && (
      <Tabs defaultValue="overview" className="space-y-4 animate-fade">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <FadeLeft className="grid gap-2 md:gap-4 grid-cols-2">
            <SummaryCard
              title="Total"
              contentText={formatCurrency(totalAmount)}
              contentSubText={changePercentage}
            />
            <SummaryCard
              title="Partial Total"
              contentText={formatCurrency(partialTotal)}
            >
              {ownerBalances.map((balance: OwnerBalance) => (
                <div
                  className="text-sm text-left"
                  key={`${balance.amount}-accordion`}
                >
                  <div className="flex" key={`${balance.amount}-wrapper`}>
                    <div
                      className="mr-2 min-w-[60px] text-muted-foreground font-bold"
                      key={`${balance.amount}-owner`}
                    >
                      {balance.owner}:
                    </div>
                    <div
                      className="flex text-muted-foreground"
                      key={`${balance.amount}-amount`}
                    >
                      {formatCurrency(balance.amount)}
                      {balance.difference && (
                        <span
                          className="ml-2 text-slate-600 hidden xs:flex"
                          key={`${balance.amount}-difference`}
                        >
                          {balance.difference}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </SummaryCard>
          </FadeLeft>
        </TabsContent>
      </Tabs>
    )
  );
}

export default Summary;
