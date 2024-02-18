import { Title } from '@/components/ui/text';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { Containers } from '@/components/ui/containers';
import { FadeUp } from '@/components/ui/animations/fade';
import { usePaymentData } from '@/lib/hooks/payments-hooks';
import { OwnerBalance } from '@/models/owner-balance';
import { useEffect, useState } from 'react';
import PaymentsTable from './components/payments/table';
import Summary from './components/summary/summary';

export default function App() {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [partialTotal, setPartialTotal] = useState<number>(0);
  const [ownerBalances, setOwnerBalances] = useState<OwnerBalance[]>([]);

  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const { totalsPerYear, table, onDeleteConfirmed, onRefresh } =
    usePaymentsTable({
      data: payments,
      selectedYear,
      refreshData,
    });

  const amountPartialSum = table
    .getFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue('amount')))
    .reduce((total, currentAmount) => total + currentAmount, 0);

  useEffect(() => {
    const amountSum = table
      .getFilteredRowModel()
      .rows.map((r) => parseFloat(r.getValue('amount')))
      .reduce((total, currentAmount) => total + currentAmount, 0);

    setTotalAmount(amountSum);
    setPartialTotal(amountPartialSum);

    const balances: OwnerBalance[] = [];

    table
      .getFilteredRowModel()
      .rows.map((r) => ({
        amount: parseFloat(r.getValue('amount')),
        owner: r.getValue('owner'),
      }))
      .forEach((item) => {
        const existingOwnerBalance = balances.find(
          (balance) => balance.owner === item.owner
        );
        if (existingOwnerBalance) {
          existingOwnerBalance.amount += item.amount;
        } else {
          balances.push({
            owner: item.owner as string,
            amount: item.amount,
          });
        }
      });

    const sort = (a: OwnerBalance, b: OwnerBalance) => {
      return a.owner.localeCompare(b.owner);
    };

    setOwnerBalances(balances.sort(sort));
    // eslint-disable-next-line
  }, [selectedYear, amountPartialSum]);

  return (
    <>
      <Title title="Expenses" />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Containers>
        <Summary
          ownerBalances={ownerBalances}
          totalAmount={totalAmount}
          partialTotal={partialTotal}
          totalsPerYear={totalsPerYear}
          selectedYear={selectedYear ?? ''}
        />
      </Containers>
      <FadeUp>
        <div className="mt-4">
          <PaymentsTable
            table={table}
            onDeleteConfirmed={onDeleteConfirmed}
            onRefresh={onRefresh}
          />
        </div>
      </FadeUp>
    </>
  );
}
