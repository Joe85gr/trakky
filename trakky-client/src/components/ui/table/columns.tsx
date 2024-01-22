import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/infrastructure/payment.tsx";
import { formatCurrency, formatDateMonth, formatStringDate } from "@/lib/formatter.ts";
import { fuzzySort } from "@/lib/filters.ts";
import { EditCell } from "@/components/ui/table/edit-cell.tsx";
import { PaymentForm } from "@/components/ui/table/payment-form.tsx";
import { Budget } from "@/infrastructure/budget.tsx";
import { BudgetForm } from "@/components/ui/table/budget-form.tsx";


export const PaymentColumnDefinition = (refresh: (flushPaymentsBeforeRefresh: boolean) => void): ColumnDef<Payment, number | string>[] => {

  return [
    {
      accessorKey: "date",
      header: "Month",
      enableColumnFilter: true,
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const formatted = formatDateMonth(row.getValue("date"));

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      filterFn: "fuzzy",
      sortingFn: fuzzySort,
      cell: ({ row }) => {
        return <div className="font-sm">{row.getValue("type")}</div>;
      },
    },
    {
      accessorKey: "owner",
      header: "User",
      filterFn: "fuzzy",
      sortingFn: fuzzySort,
      cell: ({ row }) => {
        return <div className="font-sm">{row.getValue("owner")}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = formatCurrency(amount);

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return <div className="font-sm">{row.getValue("description")}</div>;
      },
    },
    {
      id: 'edit',
      enableHiding: false,
      header: () => null,
      cell: ({ row }) => {
        return (
          <>
            <EditCell id={(row.original as Payment).id}>
              <PaymentForm
                editValues={row.original as Payment}
                refresh={refresh}
                title={"Edit Transaction"}
              ></PaymentForm>
            </EditCell>
          </>
        )
      },
    },
  ];
}

export const BudgetColumnDefinition = (budgets: Budget[] | null, refresh: (flushPaymentsBeforeRefresh: boolean) => void): ColumnDef<Budget, number | string>[] => {

  return [
    {
      accessorKey: "date",
      header: "Date",
      enableColumnFilter: true,
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const formatted = formatStringDate(row.getValue("date"));

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("budget"));
        const formatted = formatCurrency(amount);

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: "maxBudget",
      header: "Max Budget",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("maxBudget"));
        const formatted = formatCurrency(amount);

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      id: 'edit',
      enableHiding: false,
      header: () => null,
      cell: ({ row }) => {
        return budgets && (
          <>
            <EditCell id={(row.original as Budget).id}>
              <BudgetForm
                editValues={row.original as Budget}
                refresh={refresh}
                title={"Edit Budget"}
                existingDates={budgets.map((b) => new Date(b.date))}
              ></BudgetForm>
            </EditCell>
          </>
        )
      },
    },
  ];
}

export const colSize = (id: string): number | string => {
  switch (id) {
    case "description":
      return "auto";
    case "edit":
      return 20;
    case "date":
      return 90;
    case "type" || "owner":
      return 80;
    case "amount":
      return 115;
    default:
      return 100;
  }
};