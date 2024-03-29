'use client';

import { flexRender, Header, Table as TableType } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { twMerge } from 'tailwind-merge';
import Filter from '@/components/ui/table/column-filter';
import { colSize } from '@/components/ui/table/columns';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SubTitle } from '@/components/ui/text';
import { SubmittableInput } from '@/components/ui/input';
import DeleteDialog from '@/components/ui/table/delete-popup';
import { StorageKey } from '@/constants';
import {
  ChevronDownIcon,
  Fuel,
  Gift,
  HandCoins,
  Plane,
  Utensils,
} from 'lucide-react';
import { formatStringDate } from '@/lib/formatter';

export interface CustomTableProps<TData> {
  table: TableType<TData>;
  page: string;
  filtersOnly: boolean;
  canHideRows?: boolean;
}

export function CustomTable<TData extends object>({
  table,
  filtersOnly,
  page,
  canHideRows,
}: CustomTableProps<TData>) {
  const [showTableBody, setShowTableBody] = useState<boolean>(!filtersOnly);

  const activeColumnsKey = `${page}_${StorageKey.ActiveColumns}`;

  useEffect(() => {
    const storedActiveColumns = localStorage.getItem(activeColumnsKey);

    if (storedActiveColumns) {
      try {
        table.setColumnVisibility(JSON.parse(storedActiveColumns));
      } catch (e) {
        localStorage.removeItem(activeColumnsKey);
      }
    } else {
      let activeColumns = '{';
      Object.values(table.getAllColumns()).forEach((column) => {
        if (column.getCanHide()) {
          activeColumns += `"${column.id}":${column.getIsVisible()},`;
        }
      });
      activeColumns = activeColumns.substring(0, activeColumns.length - 1);
      activeColumns += '}';
      localStorage.setItem(activeColumnsKey, activeColumns);
    }
  }, [activeColumnsKey, table]);

  const saveActiveCols = (col: string, state: boolean) => {
    const storedActiveColumns = localStorage.getItem(activeColumnsKey);

    if (storedActiveColumns) {
      const activeColumns = JSON.parse(storedActiveColumns);
      activeColumns[col] = state;
      localStorage.setItem(activeColumnsKey, JSON.stringify(activeColumns));
    }
  };

  const categoryIcon = (category: string) => {
    if (category === 'General') {
      return (
        <Utensils
          strokeWidth={1}
          alignmentBaseline="middle"
          className="text-muted-foreground flex text-sm text-justify mt-1"
          height="100%"
        />
      );
    }

    if (category === 'Bills') {
      return (
        <HandCoins
          strokeWidth={1}
          alignmentBaseline="middle"
          className="text-muted-foreground flex text-sm text-justify mt-1"
          height="100%"
        />
      );
    }

    if (category === 'Personal') {
      return (
        <Gift
          strokeWidth={1}
          alignmentBaseline="middle"
          className="text-muted-foreground flex text-sm text-justify mt-1"
          height="100%"
        />
      );
    }

    if (category === 'Transport') {
      return (
        <Fuel
          strokeWidth={1}
          alignmentBaseline="middle"
          className="text-muted-foreground flex text-sm text-justify mt-1"
          height="100%"
        />
      );
    }

    if (category === 'Food') {
      return (
        <Utensils
          strokeWidth={1}
          alignmentBaseline="middle"
          className="text-muted-foreground flex text-sm text-justify mt-1"
          height="100%"
        />
      );
    }

    if (category === 'Travel') {
      return (
        <Plane
          strokeWidth={1}
          alignmentBaseline="middle"
          className="text-muted-foreground flex text-sm text-justify mt-1"
          height="100%"
        />
      );
    }

    return null;
  };
  const renderFilterCells = (header: Header<TData, unknown>) => {
    if (header.column.getCanFilter())
      return <Filter column={header.column} table={table} />;

    if (header.id === 'edit') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-row justify-center align-middle">
              <ChevronDownIcon className="h-4 w-4 cursor-pointer mx-1.5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide() && column.getCanPin())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(value);
                      saveActiveCols(column.id, value);
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  return (
    <div>
      <Table className="bg-slate-950 border border-slate-800 overflow-x-scroll">
        <TableHeader className="hover:bg-transparent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border border-slate-800">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="h-full border border-slate-800 text-center text-xs md:text-sm"
                    key={header.id}
                    {...{
                      colSpan: header.colSpan,
                      style: {
                        backgroundColor: 'bg-slate-950',
                        width: colSize(header.id),
                        maxWidth: colSize(header.id),
                        overflow: 'auto',
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: 'cursor-pointer select-none',
                            onClick: showTableBody
                              ? header.column.getToggleSortingHandler()
                              : () => {},
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {renderFilterCells(header)}
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {showTableBody &&
            !filtersOnly &&
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  onClick={row.getToggleSelectedHandler()}
                  className={twMerge(
                    'hover:bg-slate-800/50 border border-slate-800',
                    row.getIsSelected() && 'bg-slate-600/50 hover:bg-slate-600'
                  )}
                  {...{
                    style: {
                      overflow: 'auto',
                    },
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="h-8 px-2 truncate text-sm">
                        {cell.id.includes('type') ? (
                          <div className="flex flex-row align-middle gap-x-2 justify-center">
                            {categoryIcon(row.getValue('type'))}
                            <div className="flex flex-col">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                              <div className="text-xxs font-thin text-muted-foreground">
                                {formatStringDate(row.getValue('date'))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-row align-middle gap-1">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </TableRow>
              );
            })}
          {!filtersOnly && canHideRows && (
            <TableRow className="p-0 m-0" aria-label="Hide Table Button">
              <td colSpan={table.getAllColumns().length} className="p-0 m-0">
                <Button
                  variant="outline"
                  onClick={() => setShowTableBody(!showTableBody)}
                  className="w-full rounded-none h-6 p-0 m-0 text-muted-foreground"
                >
                  {showTableBody ? 'Hide' : 'Show'} data
                </Button>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  canHideRows: false,
};

CustomTable.displayName = 'CustomTable';
interface CustomSmallTableProps {
  title: string;
  onAdd: () => void;
  newValue: string;
  setNew: (value: string) => Promise<void> | void;
  values: SmallTableRow[];
  onDeleteConfirmed: (id: number) => Promise<void>;
}

export interface SmallTableRow {
  id: number;
  name: string;
}

export function CustomSmallTable({
  title,
  onAdd,
  newValue,
  setNew,
  values,
  onDeleteConfirmed,
}: CustomSmallTableProps) {
  return (
    <div className="flex-grow">
      <SubTitle
        title={title}
        {...{ className: 'text-center mt-4 mb-0 lg:mb-6' }}
      />
      <div className="flex my-2 flex-row lg:flex-row justify-around">
        <Button
          disabled={newValue.length === 0}
          onClick={onAdd}
          type="submit"
          variant="outline"
          className="rounded-r-none border-green-500/50 hover:bg-green-500/50"
        >
          Add
        </Button>
        <SubmittableInput
          onSubmit={onAdd}
          onChange={(e) => setNew(e.target.value)}
          className="rounded-l-none focus-visible:ring-0 h-8 outline-none"
        />
      </div>
      <table>
        <tbody>
          {values &&
            values.map((value: SmallTableRow) => (
              <TableRow
                key={value.id}
                className="w-full justify-center align-middle"
              >
                <td
                  className={twMerge(
                    `text-left border-r-0 py-0.5 px-2 font-thin text-xs w-full border overflow-x-scroll scroll-smooth`
                  )}
                >
                  {value.name}
                </td>
                <td
                  className="m-6 text-left border px-0 overflow-x-scroll scroll-smooth"
                  aria-label="Delete Selected Rows"
                >
                  <DeleteDialog
                    onDeleteConfirmed={() => onDeleteConfirmed(value.id)}
                    entries={value.name}
                    tooltipText="Delete"
                  />
                </td>
              </TableRow>
            ))}
        </tbody>
      </table>
    </div>
  );
}

CustomSmallTable.displayName = 'CustomSmallTable';
