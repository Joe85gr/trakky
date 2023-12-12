import { SectionContainer } from "@/components/ui/section-container.tsx";
import { ExpensesTable } from "./components/table";
import { Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks/page-hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { useTable } from "@/lib/hooks/table-hooks.ts";
import { Summary } from "@/app/expenses/components/summary.tsx";
import { useEffect } from "react";


export default function ExpensesPage() {
  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const {
    totalsPerYear,
    table,
    onDeleteConfirmed,
    onPaymentEdited,
    onRefresh,
  } = useTable({
    data: payments,
    selectedYear,
    refreshData,
  })

  useEffect(() => {
    const activeColumns = localStorage.getItem("expenses_active_columns");

    if(activeColumns) {
      try {
        table.setColumnVisibility(JSON.parse(activeColumns));
      } catch (e) {
        localStorage.removeItem("expenses_active_columns")
        console.log(e);
      }
    }
  }, []);

  return (
  <>
    <SectionContainer>
      <Text title={"Expenses"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Summary
        table={table}
        totalsPerYear={totalsPerYear}
        selectedYear={selectedYear ?? ""}
      />
    </SectionContainer>
      <ExpensesTable
        expensesTableProps={{
          table,
          onDeleteConfirmed,
          onPaymentEdited,
          onRefresh,
          page: "expenses",
        }}
      />
  </>
  );
}
