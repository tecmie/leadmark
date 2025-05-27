import { cn } from '@/utils/ui';
import { Separator } from './separator';

interface StepProps {
  count: number;
  isActive: boolean;
}

const Step = ({ count, isActive }: StepProps) => {
  return (
    <div
      className={cn(
        'w-5 h-5 border border-link flex items-center justify-center rounded-md text-[10px]',
        {
          'bg-link text-primary': isActive,
          'bg-transparent text-link': !isActive
        }
      )}
    >
      {count}
    </div>
  );
};

interface StepperProps {
  className?: string;
  activeStep?: number;
}

export const Stepper = ({ className, activeStep = 1 }: StepperProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Step count={1} isActive={activeStep >= 1} />
      <Separator className="flex-1 bg-gray-600" />
      <Step count={2} isActive={activeStep >= 2} />
      <Separator className="flex-1 bg-gray-600" />
      <Step count={3} isActive={activeStep == 3} />
    </div>
  );
};
