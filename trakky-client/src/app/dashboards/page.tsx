import { CustomTable } from "@/components/ui/table/table.tsx";
import { SubTitle, Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks/page-hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { usePaymentsTable } from "@/lib/hooks/table-hooks.ts";
import { Payment } from "@/infrastructure/payment.tsx";
import { useEffect, useState } from "react";
import { ExpensesPieChart, UsersDashboard, ExpensesDashboard } from "@/app/dashboards/components/dashboards.tsx";
import { useDashboards } from "@/lib/hooks/dashboards-hooks.ts";
import { FadeLeft } from "@/components/animations/fade.tsx";

function DashboardPage() {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const {
    table,
  } = usePaymentsTable({
    data: payments,
    selectedYear,
    refreshData,
  })

  useEffect(() => {

    const filteredPayments = table
      .getFilteredRowModel()
      .rows
      .map((row) => (
        {
          id: row.getValue("date"),
          amount: row.getValue("amount"),
          type: row.getValue("type"),
          owner: row.getValue("owner"),
          description: row.getValue("description"),
          date: row.getValue("date")
        }) as Payment);

    setFilteredPayments(filteredPayments);
  }, [table.getFilteredRowModel()]);

  const {
    paymentOverviews,
    ownersOverview,
    expensesBreakdown
  } = useDashboards({ data: filteredPayments, selectedYear });

  return (
    <>
      <Text title={"Dashboards"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <FadeLeft>

        <div className="mt-6 text-center">
            <SubTitle title={"Filters"} />
          <CustomTable
            tableProps={{
              table,
              filtersOnly: true,
              page: "overview",
            }}
            {...{ className: "lg:col-span-1" }}
          />
        </div>

      </FadeLeft>

      <div className="mt-6 text-center mr-4 lg:mx-0">
          <div className="lg:grid gap-4 lg:grid-cols-2">
            <div className="mt-4 sm:mt-0">
              <SubTitle title={"Expenses"} />
              <ExpensesDashboard data={paymentOverviews} />
            </div>
            <div className="mt-4 sm:mt-0">
              <SubTitle title={"Users Comparison"} />
              <UsersDashboard data={ownersOverview} />
            </div>

          </div>
          <div>
            <SubTitle title={"Breakdown"} />
            <ExpensesPieChart data={expensesBreakdown}></ExpensesPieChart>
          </div>
      </div>
    </>
  );
}

export default DashboardPage;
