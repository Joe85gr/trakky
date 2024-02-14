/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterFn, SortingFn, sortingFns } from '@tanstack/react-table';
import { compareItems, rankItem } from '@tanstack/match-sorter-utils';

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!
    );
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

declare global {
  interface Array<T> {
    filterBy(str: string): string[];
  }
}

Array.prototype.filterBy = function (str: string): string[] {
  return this.filter((item) =>
    new RegExp(`^${str.replace(/\*/g, '.*')}$`).test(item)
  );
};
