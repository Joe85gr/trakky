import { Title } from '@/components/ui/text';
import {
  usePaymentData,
  useFilteredPayments,
} from '@/lib/hooks/payments-hooks';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { Containers } from '@/components/ui/containers';
import { FadeUp } from '@/components/ui/animations/fade';
import PaymentsTable from '@/components/payments/table';
import Dashboards from '@/components/dashboards/dashboards';
import Summary from '@/components/summary/summary';
import useDashboards from '@/lib/hooks/use-dashboard';

function OverviewPage() {
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

  const filteredPayments = useFilteredPayments(table);

  const { paymentOverviews, ownersOverview, expensesBreakdown } = useDashboards(
    { data: filteredPayments, selectedYear }
  );

  return (
    <>
      <Title title="Overview" />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Containers>
        <Summary
          table={table}
          totalsPerYear={totalsPerYear}
          selectedYear={selectedYear ?? ''}
        />
      </Containers>
      <FadeUp>
        <div className="mt-6 text-center">
          <PaymentsTable
            table={table}
            onDeleteConfirmed={onDeleteConfirmed}
            onRefresh={onRefresh}
          />
        </div>
        <Dashboards
          paymentOverviews={paymentOverviews}
          ownersOverview={ownersOverview}
          expensesBreakdown={expensesBreakdown}
        />
      </FadeUp>
    </>
  );
}

export default OverviewPage;
