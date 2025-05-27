'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function ModeToggle(isExpanded: { isExpanded: boolean }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center ${
            isExpanded.isExpanded ? 'justify-between' : 'justify-center'
          }  gap-3`}
        >
          {isExpanded.isExpanded && <span>Appearance</span>}
          <Button
            variant="outline"
            className="border-[#0000000A] text-primary-100 dark:bg-transparent bg-primary-base outline-none"
            size="icon"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="dark:text-primary-100 text-nuetral bg-primary-base dark:bg-surface-strong"
      >
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
