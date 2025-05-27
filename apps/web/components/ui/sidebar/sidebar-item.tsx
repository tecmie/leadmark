import { CaretRightIcon, DotIcon } from '@/components/icons/sidebar';
import { cn } from '@/utils/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SVGProps } from 'react';
import { Tooltip } from '../tooltip';

interface SidebarItem {
  icon: React.FC<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
}

interface SidebarItemProps extends SidebarItem {
  isExpanded?: boolean;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isExpanded = true
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(href);

  const children = (
    <Link
      href={href}
      className={cn(
        ' sm:p-2 p-4 rounded-none flex items-center gap-3',
        {
          ' text-black font-medium': isActive
        },
        {
          'dark:text-[#FFFFFFA3] text-[#000000A3]': !isActive
        },
        { 'w-12 justify-center': !isExpanded },
        { 'w-full justify-between': isExpanded }
      )}
    >
      <div className="flex items-center justify-center gap-3">
        <Icon
          className={cn(
            'w-4 h-4',
            {
              'text-black justify-center fill-black': isActive
            },
            {
              'dark:text-primary-100 text-[#000000A3] fill-black': !isActive
            }
          )}
        />

        <span className={cn('', { ' hidden': !isExpanded })}>{label}</span>
      </div>
      <CaretRightIcon
        className={cn(
          'sm:hidden block w-4 h-4',
          {
            'text-black': isActive
          },
          {
            ' text-[#000000A3] dark:text-[#FFFFFFA3]': !isActive
          },
          { ' hidden': !isExpanded }
        )}
      />{' '}
      {isExpanded && (
        <DotIcon
          className={cn(
            'hidden sm:block',
            {
              'dark:text-black text-primary-100': isActive
            },
            {
              'text-white opacity-0': !isActive
            }
          )}
        />
      )}
    </Link>
  );

  const Slot = isExpanded
    ? children
    : Tooltip({ content: label, side: 'right', align: 'center', children });

  return Slot;
};
