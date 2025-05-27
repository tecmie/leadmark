import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/ui';
import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';
import { Button } from '../button';
import { LinkPreview } from '../link-preview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../select';
import { Textarea } from '../textarea';

export const AddFolderDialog = ({
  openDialog,
  closeDialog
}: {
  openDialog: boolean;
  closeDialog: () => void;
}) => {
  const colors = [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' }
  ];
  const [links, setLinks] = useState<string[]>(['']);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleNextClick = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleCancelClick = () => {
    // Implement cancel logic if needed
  };

  const handleSubmit = () => {
    // Implement submit logic
  };

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="bg-white p-6 dark:bg-background text-neutral sm:max-w-[425px] border-none rounded-t-[40px] sm:rounded-[40px] translate-y-0 sm:translate-y-[-50%] bottom-0 sm:top-[50%] sm:h-fit data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-[#000000A3] dark:text-neutral-strong">
            Add a folder
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <span className="text-sm text-[#000000A3] dark:text-neutral-strong">
            Step <b>{currentStep}</b> of <b>2</b>
          </span>
        </div>
        {currentStep === 1 && (
          <>
            <div className="overflow-scroll max-h-60 sm:max-h-fit [&::-webkit-scrollbar]:hidden w-full">
              <div className="flex flex-col items-start justify-start gap-2">
                <h1 className="text-[#000000A3] dark:text-neutral-strong font-bold">
                  Create folder
                </h1>
                <p className="text-[#000000A3] dark:text-neutral-strong text-sm">
                  Folders are designed to automatically categorize and manage
                  incoming mails. Fill in the required information and pick a
                  color to identify the folder.
                </p>
              </div>
              <div className="flex flex-col gap-4 py-2.5 overflow-auto">
                <div className="flex flex-col gap-2.5">
                  <Label
                    htmlFor="name"
                    className="text-left text-[#000000A3] dark:text-neutral-strong"
                  >
                    Folder name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Pedro Duartund"
                    className=" text-[#000000A3] dark:text-neutral-strong"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label
                    htmlFor=""
                    className="text-left text-[#000000A3] dark:text-neutral-strong"
                  >
                    Nest folder under
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paystack">Sales</SelectItem>
                      <SelectItem value="Stripe">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label
                    htmlFor=""
                    className="text-left text-[#000000A3] dark:text-neutral-strong"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="username"
                    placeholder="Message Specify the types of emails you wish to have sorted into this folder."
                    className=" text-[#000000A3] dark:text-neutral-strong"
                  />
                </div>
                <div className="pl-2">
                  <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                    <RadioGroup.Label className="sr-only">
                      Choose a folder color
                    </RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {colors.map((color) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={cn(
                            color.selectedClass,
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                          )}
                        >
                          {({ active }) => (
                            <>
                              <RadioGroup.Label as="span" className="sr-only">
                                {color.name}
                              </RadioGroup.Label>

                              <span
                                aria-hidden="true"
                                className={cn(
                                  color.class,
                                  color.selectedClass,
                                  active ? 'ring ring-offset-2' : '',
                                  !active ? 'ring-1' : '',
                                  'h-8 w-8 rounded-full border border-black border-opacity-10'
                                )}
                              />
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col items-center justify-center gap-3">
              <Button
                className="w-full text-white rounded-full bg-primary-base"
                type="button"
                onClick={handleNextClick}
              >
                Next
              </Button>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-transparent border rounded-full border-primary-base text-primary-base"
                  type="button"
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </>
        )}
        {currentStep === 2 && (
          <>
            <div className="flex flex-col items-start justify-start gap-2">
              <h1 className="text-[#000000A3] dark:text-neutral-strong font-bold">
                Add links
              </h1>
              <p className="text-[#000000A3] dark:text-neutral-strong">
                Enter the URL(s) of your external support content for this
                folder.
              </p>
            </div>{' '}
            <div className="w-full overflow-auto max-h-60 [&::-webkit-scrollbar]:hidden">
              <LinkPreview
                links={links}
                setLinks={setLinks}
                isPreview={false}
              />
            </div>
            <DialogFooter className="flex flex-col items-center justify-center gap-3">
              <Button
                className="w-full text-white rounded-full bg-primary-base"
                type="submit"
                onClick={handleSubmit}
              >
                Add folder
              </Button>
              <Button
                className="w-full bg-transparent border rounded-full border-primary-base text-primary-base"
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
