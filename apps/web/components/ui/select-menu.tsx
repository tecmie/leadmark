'use client';

import { cn } from '@/utils/ui';
import { ChevronDown } from 'lucide-react';
import { buttonVariants } from './button';
import { Checkbox } from './checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from './dropdown-menu';

interface SelectMenuProps {
  selectedState: 'all' | 'none';
  toggleSelectedState: (value?: boolean | undefined) => void;
}

export const SelectMenu = ({
  selectedState,
  toggleSelectedState
}: SelectMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'link' }),
          'text-neutral p-0 flex items-center gap-1 h-5 rounded-sm border-none'
        )}
        asChild
      >
        <div>
          <Checkbox
            checked={selectedState === 'all'}
            className="border-neutral-100 dark:border-neutral-weak"
          />
          <ChevronDown
            size={16}
            className="dark:text-neutral-strong text-neutral-100"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="dark:text-primary-100 text-nuetral bg-primary-150 dark:bg-surface-strong"
      >
        {['none', 'all'].map((option, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={selectedState === option}
            onCheckedChange={() => toggleSelectedState(option === 'all')}
            className="capitalize"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
