import * as React from 'react';

import { cn } from '@/utils/ui';
import { cva } from 'class-variance-authority';
import { Copy, LucideIcon, Mail } from 'lucide-react';
import { Label } from './label';

const InputVariants = cva('relative', {
  variants: {
    iconPosition: {
      left: ' absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground',
      right:
        ' absolute left-auto right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground'
    }
  },
  defaultVariants: {
    iconPosition: 'left'
  }
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  onClickStartIcon?: () => void;
  onClickEndIcon?: () => void;
  iconClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon: StartIcon,
      endIcon: EndIcon,
      iconClass,
      onClickStartIcon,
      onClickEndIcon,
      ...props
    },
    ref
  ) => {
    return (
      <>
        {StartIcon || EndIcon ? (
          <div className="relative inline-block w-full h-11">
            {StartIcon && (
              <span
                onClick={onClickStartIcon}
                className={cn(InputVariants({ iconPosition: 'left' }))}
              >
                <StartIcon className={`w-4 h-4 ml-1 ${iconClass} `} />
              </span>
            )}
            <input
              type={type}
              className={cn(
                'flex outline-none text-black dark:text-inherit h-full w-full rounded-lg border dark:border-white/20 border-[#00000029] bg-transparent py-4 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50',
                className,
                StartIcon && EndIcon
                  ? 'pl-10 pr-10'
                  : StartIcon
                    ? 'pl-10 pr-6'
                    : 'pl-3 pr-10'
              )}
              ref={ref}
              {...props}
            />
            {EndIcon && (
              <span
                onClick={onClickEndIcon}
                className={cn(InputVariants({ iconPosition: 'right' }))}
              >
                <EndIcon />
              </span>
            )}
          </div>
        ) : (
          <input
            type={type}
            className={cn(
              'flex outline-none h-11 text-black dark:text-black w-full rounded-md border border-[#00000029] p-4 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={ref}
            {...props}
          />
        )}
      </>
    );
  }
);
Input.displayName = 'Input';

export interface LabelledInputProps extends InputProps {
  label: string;
}

const LabelledInput = React.forwardRef<HTMLInputElement, LabelledInputProps>(
  ({ label, name, ...rest }, ref) => (
    <div className="flex flex-col w-full gap-2">
      <Label
        htmlFor={name}
        className="text-xs text-left text-[#000000A3] dark:text-neutral-strong"
      >
        {label}
      </Label>
      <Input ref={ref} name={name} {...rest} />
    </div>
  )
);

LabelledInput.displayName = 'LabelledInput';

const EmailInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, ...props }, ref) => (
    <div className="relative inline-block h-11">
      <span
        className={cn(
          InputVariants({ iconPosition: 'left' }),
          'hidden sm:block'
        )}
      >
        <Mail className="w-4 h-4" />
      </span>
      <input
        ref={ref}
        type={type}
        name={name}
        className={cn(
          'flex h-full w-full rounded-lg border border-[#00000029] bg-transparent py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
          'pl-3 sm:pl-10 pr-28'
        )}
        {...props}
      />

      <span
        className={cn(InputVariants({ iconPosition: 'right' }), 'text-link')}
      >
        @{props.title}
      </span>
    </div>
  )
);

EmailInput.displayName = 'EmailInput';

const LinkInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, onClickEndIcon, ...props }, ref) => (
    <div className="relative inline-block w-full h-11">
      <span
        className={cn(InputVariants({ iconPosition: 'left' }), 'text-link')}
      >
        inbox.me/
      </span>

      <input
        ref={ref}
        type={type}
        name={name}
        className={cn(
          'flex h-full w-full rounded-lg border bg-transparent py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
          'pl-20 pr-10'
        )}
        {...props}
      />

      <span
        onClick={onClickEndIcon}
        className={cn(
          InputVariants({ iconPosition: 'right' }),
          'cursor-pointer'
        )}
      >
        <Copy size={16} />
      </span>
    </div>
  )
);

LinkInput.displayName = 'LinkInput';

export { EmailInput, Input, LabelledInput, LinkInput };
