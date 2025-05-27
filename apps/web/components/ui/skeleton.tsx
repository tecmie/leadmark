import { cn } from '@/utils/ui';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md dark:bg-border-neutral-weaker bg-primary-50',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
