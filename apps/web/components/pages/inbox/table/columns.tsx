'use client';

import { Avatar } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Thread } from '@repo/types';
import { ColumnDef } from '@tanstack/react-table';
import { LucideCheck } from 'lucide-react';

export const columns: ColumnDef<Thread>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className=" translate-x-[2px] mx-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: 'avatar',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col h-full gap-1 pr-2 sm:pr-2">
          {!row.getIsSelected() ? (
            <Avatar
              label={
                row.original.contactName
                  ? row.original.contactName
                  : row.original.contact_metadata
                    ? (
                        row.original.contact_metadata as {
                          [key: string]: string;
                        }
                      )?.Name
                    : 'AB'
              }
              className="bg-blue-300"
            />
          ) : (
            <LucideCheck className="w-10 h-10 rounded-full bg-primary-200 p-2 text-white" />
          )}
        </div>
      );
    },
  },
  {
    id: 'last_updated',
    accessorKey: 'last_updated',
    header: 'Date',
    cell: ({ row }) => {
      function formatLastUpdated() {
        const date = new Date(row.getValue('last_updated'));

        // Get the current date and time
        const now = new Date();

        // Calculate the time difference in milliseconds
        const timeDifference: number = now.getTime() - date.getTime();

        // Calculate the time difference in days
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );

        // Check if the date is from today
        if (daysDifference === 0) {
          // Format the time in HH:mm AM/PM
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });

          return `${formattedTime}`;
        } else if (daysDifference === 1) {
          return 'Yesterday';
        } else if (daysDifference < 7) {
          // Format the day of the week
          const formattedDay = date.toLocaleDateString('en-US', {
            weekday: 'long',
          });

          return formattedDay;
        } else {
          // Format the date in the format "MMM DD"
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return formattedDate;
        }
      }
      return (
        <div className="flex flex-shrink-0 flex-col gap-2 pr-4 text-[#000000A3]">
          <div className="flex justify-between w-full gap-1">
            <div className="flex flex-col w-full m-0">
              <p className="m-0 text-base">
                {row.original.contactName
                  ? row.original.contactName
                  : row.original.contact_metadata
                    ? (
                        row.original.contact_metadata as {
                          [key: string]: string;
                        }
                      )?.Name
                    : ''}
              </p>
              <p className={`column-message text-ellipsis p-0 m-0 text-sm`}>
                {row.original.subject}
              </p>
            </div>
            <div className="text-sm whitespace-nowrap">
              {formatLastUpdated()}
            </div>
          </div>
          {/* {row?.original?.message?.message_text && (
            <div className="text-sm wrap-message w-[300px] sm:w-[270px]">
              {row.original.message.message_text}
            </div>
          )} */}
        </div>
      );
    },
  },
  {
    id: 'subject',
    accessorKey: 'subject',
    header: 'Subject',
    cell: () => {},
  },
  {
    id: 'from',
    accessorKey: 'from',
    header: 'From',
    cell: () => {},
  },
];
