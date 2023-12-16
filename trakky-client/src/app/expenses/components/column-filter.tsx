import { Column } from "@tanstack/react-table";
import { Payment } from "@/infrastructure/payment.tsx";
import { useMemo } from "react";
import { DebouncedInput, DebouncedSelect } from "@/app/expenses/components/debounce-input.tsx";
import { convertFilterDateFormat, formatDate, isValidDate } from "@/lib/formatter";

export function Filter({
  column,
  table,
}: {
  column: Column<Payment>;
  table: any;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : isValidDate(firstValue) ? Array.from(column.getFacetedUniqueValues().keys())
          .reduce((acc, date) => {
            const formattedDate = formatDate(date);
            if (!acc.some((obj: any) => obj.key === formattedDate)) {
              acc.push({ key: formattedDate, value: convertFilterDateFormat(date) });
            }
            return acc;
          }, [])
          : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()],
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-0.5">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder="Min"
          className="rounded-none w-1/2 placeholder-slate-700 placeholder:text-xs selection:bg-slate-700 focus:bg-slate-700  shadow bg-slate-800 pl-1 focus:outline-none"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder="Max"
          className="rounded-none w-1/2 placeholder-slate-700 placeholder:text-xs selection:bg-slate-700 focus:bg-slate-700  shadow bg-slate-800 pl-1 focus:outline-none"
        />
      </div>
    </div>
  ) : isValidDate(firstValue) ? (
    <>
      <div className="overflow-auto">
        <div className="flex space-x-0.5">
          <DebouncedSelect
            options={sortedUniqueValues}
            value={(columnFilterValue ?? "") as string}
            onChange={(value) => {
              column.setFilterValue(value == "All" ? "" : value)
            }}
          />
        </div>
      </div>
    </>
  ) : (
    <>
      <datalist className="bg-slate-900" id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option className="border-slate-900 red" value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={""}
        className="rounded-none w-full shadow bg-slate-800 text-slate-400 selection:bg-slate-700 pl-2 focus:bg-slate-700 focus:outline-none"
        list={column.id + "list"}
      />
    </>
  );
}
