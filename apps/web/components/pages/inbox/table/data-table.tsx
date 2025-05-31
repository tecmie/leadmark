'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FilterMenu,
  OrderCriteria,
  SortCriteria,
} from '@/components/ui/filter-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { IThread } from '@repo/types';

// Extended thread type that includes the additional properties returned by fetchInboxThreads
type EnhancedThread = IThread & {
  contactEmail: string;
  contactName: string;
  fullName: string;
  contact_metadata?: { [key: string]: string };
};
import useMediaQuery from '@/utils/hooks/use-media-query';
import { cn } from '@/utils/ui';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingFn,
} from '@tanstack/react-table';
import { useRouter } from '@bprogress/next/app';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  className,
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const params = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const id = Array.isArray(params?.namespace)
    ? params?.namespace[0]?.toString()
    : params?.namespace?.toString() || '';

  const [columnVisibility, setColumnVisibility] = useState({});

  const sortTable: SortingFn<EnhancedThread> = (rowA, rowB) => {
    const value = (A: string): number => {
      return A === 'Low' ? 1 : A === 'Medium' ? 2 : 3;
    };

    const Anum = value(rowA.original.subject || '');
    const Bnum = value(rowB.original.subject || '');

    if (Anum === Bnum) return 0;
    return Anum < Bnum ? 1 : -1;
  };
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
      sorting,
      rowSelection,
    },
    sortingFns: {
      customSorting: sortTable,
    },
  });
  // const handleTableOrdering = (key: OrderCriteria) => {
  //   table.getColumn('last_updated')?.toggleSorting(key === 'newest');
  // };
  const handleTableSorting = (field: string, key: OrderCriteria) => {
    if (field) {
      table.setSorting([
        {
          id: field === 'date' ? 'last_updated' : field,
          desc: key === 'newest' ? true : false,
        },
      ]);
    }
  };

  useEffect(() => {
    // ... other code

    const orderBy = (searchParams?.get('o') as OrderCriteria) ?? 'newest';
    const sortBy = searchParams?.get('s') as SortCriteria;

    if (orderBy) {
      // handleTableOrdering(orderBy);

      if (sortBy) {
        handleTableSorting(sortBy, orderBy);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    table.getColumn('actions')?.toggleVisibility(!isMobile);
    table.getColumn('select')?.toggleVisibility(!isMobile);
  }, [isMobile]);

  return (
    <>
      <ThreadHeader table={table} />
      <div
        className={cn(
          'h-full w-full flex flex-col overflow-hidden bg-white  pb-14',
          className
        )}
      >
        <div className="fixed z-20 flex items-center justify-between flex-shrink-0 w-full gap-4 px-4 py-3 bg-white sm:relative">
          <div className="flex items-center gap-2">
            <div className="text-xl font-medium text-black">All inboxes</div>
            <Badge className="bg-[#adb6f9] text-white hidden">
              2 unattended
            </Badge>
          </div>
          <FilterMenu />
        </div>
        {/* <div className="border-b h-11 bg-primary-base border-border-neutral-weaker" /> */}
        <ScrollArea className="h-full overflow-auto border-[#00000012] border-t mt-[74px] sm:mt-0 mb-[74px] sm:mb-0">
          <Table className="w-full h-full">
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    onClick={() =>
                      router.push(
                        `/inbox/u/${(row.original as EnhancedThread).namespace}`
                      )
                    }
                    className="w-full border-none"
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {' '}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'px-0 py-3 cursor-pointer border-b border-[#00000012] ',
                          {
                            'bg-muted/50':
                              (row.original as EnhancedThread).namespace === id,
                          }
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}{' '}
                  </TableRow>
                ))
              ) : (
                <TableRow className="cursor-default hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No emails yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
}

export const ThreadHeader = ({ table }: { table: any }) => (
  <div className="absolute top-0 left-0 right-0 z-30 hidden px-4 bg-white rounded-tr-lg sm:flex">
    <div className="flex items-center py-1 space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
        <label
          htmlFor="select"
          className="font-normal leading-none text-[#000000A3] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select all
        </label>
      </div>
      <Separator orientation="vertical" className="h-3 bg-[#00000029]" />
      <Button variant="ghost" className="p-0 font-normal text-destructive">
        Delete
        <Trash2 size="sm" className="w-4 h-4" />
      </Button>
    </div>
    <div className="items-center justify-between hidden w-full py-1 space-x-4 text-base">
      <div className="flex items-center space-x-4">
        <Checkbox
          id="select"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
        <label
          htmlFor="select"
          className="font-normal leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select all
        </label>
      </div>
      <Button variant="ghost" className="p-0 font-normal text-destructive">
        <Trash2 size="sm" className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
