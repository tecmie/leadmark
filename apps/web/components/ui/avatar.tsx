'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn, stringToHslColor } from '@/utils/ui';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full  text-white uppercase',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface AvatarComponentProps {
  className?: string;
  src?: string;
  label?: string;
}

const AvatarComponent = ({ className, src, label }: AvatarComponentProps) => {

  const initials = label?.split(' ').map((word) => word[0]).join('').substring(0, 2);
  const avatarBG = stringToHslColor(label || "wootiv", 27, 83);
  const avatarFG = stringToHslColor(label || "wootiv", 25, 20);

  return (
    <Avatar style={{ backgroundColor: avatarBG }} className={cn(`w-10 h-10`, className)}>
      <AvatarImage src={src} />
      {label && <AvatarFallback style={{ textTransform: 'uppercase', fontWeight: 500, color: avatarFG }}>{initials}</AvatarFallback>}
    </Avatar>
  );
};

export { AvatarComponent as Avatar };
