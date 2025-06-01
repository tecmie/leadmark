'use client';

import useDisclosure from '@/utils/hooks/useDisclosure';
import { cn } from '@/utils/ui';
import { ListFilter, Paperclip } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ActionDialog } from '../pages/settings/actions/action-dialog';
import { buttonVariants } from './button';
import { Checkbox } from './checkbox';

export type QueryKey = 'f' | 's' | 'o';
export type SortCriteria = 'date' | 'from' | 'size' | 'subject';
export type OrderCriteria = 'newest' | 'oldest';

export const FilterMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const sortOptions: SortCriteria[] = ['date', 'from', 'size', 'subject'];
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('date');
  // Track the selected values
  const [selectedSortCriteria, setSelectedSortCriteria] =
    useState<SortCriteria>('date');
  const [selectedOrderCriteria, setSelectedOrderCriteria] =
    useState<OrderCriteria>('newest');
  const orderOptions: OrderCriteria[] = ['newest', 'oldest'];
  const [OrderCriteria, setOrderCriteria] = useState<OrderCriteria>('newest');
  const [loading, setLoading] = useState(false);
  const handleSelect = (key: QueryKey, value: string) => {
    // Update the selected values in the state without pushing to the route
    if (key === 's') {
      setSelectedSortCriteria(value as SortCriteria);
    } else if (key === 'o') {
      setSelectedOrderCriteria(value as OrderCriteria);
    }
  };

  const handleSortChange = (option: SortCriteria) => {
    setSortCriteria(option);
    handleSelect('s', option);
  };

  const handleOrderChange = (option: OrderCriteria) => {
    setOrderCriteria(option);
    handleSelect('o', option);
  };

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Push to the route with the selected values when the "Filter" button is clicked
    router.push(
      `${pathname}?s=${selectedSortCriteria}&o=${selectedOrderCriteria}`
    );
  };

  useEffect(() => {
    setLoading(false);
    onClose();
  }, [searchParams]);

  const handleClear = () => {
    // Clear all filters and sorting
    setSortCriteria('date');
    setOrderCriteria('newest');
    setSelectedSortCriteria('date');
    setSelectedOrderCriteria('newest');
  };

  return (
    <>
      <span
        className={cn(
          buttonVariants({ variant: 'link' }),
          'text-primary p-0 flex items-center gap-2 rounded-sm border-none cursor-pointer'
        )}
        onClick={() => onOpen()}
      >
        Filters <ListFilter size={16} className="text-primary" />
      </span>

      {isOpen && (
        <ActionDialog
          openDialog={isOpen}
          closeDialog={() => {
            onClose();
            handleClear();
          }}
          title="Filters"
          formProps={null}
          description=""
          handleSubmit={handleFilter}
          creating={loading}
          disableCreate={loading}
          cancelText={'Cancel'}
          btnOrder="vertical"
          createText={'Filter'}
          content={
            <div className="flex flex-col gap-6 text-foreground">
              {/* <div onClick={() => handleSelect('f', 'read')}>
                <MailOpen size={16} />
                Read
              </div>
              <div onClick={() => handleSelect('f', 'unread')}>
                <Mail size={16} />
                Unread
              </div> */}
              <div
                className="flex items-center justify-between py-4 border-b border-border"
                onClick={() => handleSelect('f', 'has_attachment')}
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    // checked={sortCriteria === option}
                    onCheckedChange={() => handleSelect('f', 'has_attachment')}
                  />
                  <label
                    htmlFor="select"
                    className="font-normal leading-none text-foreground capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Has attachment
                  </label>
                </div>
                <Paperclip size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Sort by</span>
                <div className="flex flex-col">
                  {sortOptions.map((option, index) => (
                    <div
                      className="flex items-center py-4 space-x-4 border-b border-border"
                      key={index}
                    >
                      <Checkbox
                        checked={sortCriteria === option}
                        onCheckedChange={() => handleSortChange(option)}
                      />
                      <label
                        htmlFor="select"
                        className="font-normal leading-none text-foreground capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  SORT DIRECTION
                </span>
                <div className="flex flex-col">
                  {orderOptions.map((option, index) => (
                    <div
                      className="flex items-center py-4 space-x-4 border-b border-border"
                      key={index}
                    >
                      <Checkbox
                        checked={OrderCriteria === option}
                        onCheckedChange={() => handleOrderChange(option)}
                      />
                      <label
                        htmlFor="select"
                        className="font-normal leading-none text-foreground capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option} on top
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
          BtnVariant="error"
        />
      )}
    </>
  );
};
