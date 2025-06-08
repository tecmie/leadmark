import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { cn } from '@/utils/ui';
import { ReactNode } from 'react';
interface ActionDialogProps {
  openDialog: boolean;
  maxWidth?:
    | string
    | 'max-w-xs'
    | 'max-w-sm'
    | 'max-w-md'
    | 'max-w-lg'
    | 'max-w-xl';
  title: string;
  content: ReactNode;
  description?: string;
  hidebtns?: boolean;
  hideCancelBtn?: boolean;
  cancelText: string;
  creating: boolean;
  createText: string;
  disableCreate: boolean;
  formProps: any;
  btnOrder?: string | 'vertical' | 'horizontal';
  BtnVariant?: string | 'error' | 'primary' | 'warning';
  closeDialog: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ActionDialog: React.FC<ActionDialogProps> = ({
  openDialog,
  title,
  content,
  description,
  hidebtns = false,
  hideCancelBtn = false,
  cancelText,
  creating,
  createText,
  disableCreate,
  BtnVariant,
  closeDialog,
  handleSubmit,
  formProps,
  btnOrder = 'vertical'
}) => {
  const colors: { [key: string]: string } = {
    primary:
      'bg-orange-main hover:bg-orange-500 active:bg-carton-400 text-white',
    error: 'bg-[#FE0101] hover:bg-red-600 active:bg-red-500 text-white',
    warning:
      'bg-orange-500 hover:bg-orange-400 active:bg-orange-400 text-[#F65555]'
  };
  const btnVariant = colors[BtnVariant as keyof typeof colors];

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="bg-white p-6 dark:bg-background text-neutral sm:max-w-[425px] border-none rounded-t-[40px] sm:rounded-[40px] translate-y-0 sm:translate-y-[-50%] bottom-0 sm:top-[50%] sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-[#000000A3] ">
            {title}
          </DialogTitle>
        </DialogHeader>
        {description && (
          <div className="my-2">
            <p className="text-[#000000A3] ">
              {description}
            </p>
          </div>
        )}

        <Form {...formProps}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
            <div className="max-h-60 sm:max-h-fit overflow-scroll [&::-webkit-scrollbar]:hidden">
              {content}
            </div>
            {!hidebtns && (
              <DialogFooter
                className={cn(
                  'flex items-center justify-center w-full gap-3',
                  { 'flex-col': btnOrder === 'vertical' },
                  { 'sm:flex-row flex-col': btnOrder === 'horizontal' }
                )}
              >
                <Button
                  className={cn(
                    'w-full text-white rounded-full bg-primary-base',
                    { '': btnOrder === 'vertical' },
                    { 'sm:order-2': btnOrder === 'horizontal' }
                  )}
                  type="submit"
                  disabled={disableCreate}
                >
                  {creating ? (
                    <span
                      className=" w-5 h-5 mx-auto border-t-[#f5f5f5] rounded-full
         border-l-[#f5f5f5] border-2 animate-spin
         border-r-[#f5f5f5] border-b-black"
                    />
                  ) : (
                    createText
                  )}
                </Button>
                {!hideCancelBtn && (
                  <Button
                    className="w-full bg-transparent border rounded-full border-primary-base text-primary-base"
                    type="button"
                    onClick={closeDialog}
                  >
                    {cancelText}
                  </Button>
                )}
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
