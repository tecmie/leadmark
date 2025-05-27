'use client';

import { ArrowCircleRight } from '@/components/icons/settings';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import {
  updateForwarderAction,
  updatePaymentDetailsAction
} from '@/actions/server/tools';
import useDisclosure from '@/utils/hooks/useDisclosure';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarPlus, FileText, Mail } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ActionDialog } from './action-dialog';

interface SharePaymentCardProps {
  userId: string;
  paymentData: any;
}

interface ForwarderCardProps {
  userId: string;
  forwarder: string;
}

interface SettingsActionsPageProps {
  paymentData: any;
  userId: string;
  forwarder: string;
}

const PaymentSchema = z.object({
  option: z.string().min(1, {
    message: 'Please choose an option.'
  }),
  information: z.string().min(1, {
    message: 'Please select your information.'
  }),
  link: z.string()
});

type PaymentOptions = z.infer<typeof PaymentSchema>;

const ForwarderSchema = z.object({
  email: z.string().email()
});

type ForwarderOptions = z.infer<typeof ForwarderSchema>;

export const SharePaymentCard = ({
  userId,
  paymentData
}: SharePaymentCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const form = useForm<PaymentOptions>({
    resolver: zodResolver(PaymentSchema)
  });

  useEffect(() => {
    form.setValue('option', paymentData?.option || '');
    form.setValue('information', paymentData?.information || '');
    form.setValue('link', paymentData?.link || '');
  }, [paymentData]);

  const onSubmit: SubmitHandler<PaymentOptions> = async ({
    option,
    information,
    link
  }) => {
    setIsLoading(true);
    const { message, success } = await updatePaymentDetailsAction({
      userId,
      payment: { option, information, link }
    });

    if (success) {
      toast.success(message);
      onClose();
    }

    if (!success) {
      toast.error(message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant={'default'}
        className="w-full bg-transparent border rounded-full hover:text-white hover:bg-primary-base border-primary-base text-primary-base"
        type="button"
        onClick={() => onOpen()}
      >
        Share payment details
      </Button>
      {isOpen && (
        <ActionDialog
          openDialog={isOpen}
          closeDialog={() => {
            onClose();
            form.reset();
          }}
          title="Share payment details"
          // maxWidth="max-w-[350px]"
          formProps={form}
          description="Share payment details with your contacts."
          handleSubmit={form.handleSubmit(onSubmit)}
          creating={isLoading}
          disableCreate={isLoading}
          cancelText={'Cancel'}
          createText={'Save'}
          content={
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment option</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Paystack">Paystack</SelectItem>
                        <SelectItem value="Stripe">Stripe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="information"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment information</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter payment information"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment link (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payment link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          }
          BtnVariant="error"
        />
      )}
    </>
  );
};

export const ForwarderCard = ({ userId, forwarder }: ForwarderCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const form = useForm<ForwarderOptions>({
    resolver: zodResolver(ForwarderSchema),
    defaultValues: {
      email: forwarder
    }
  });

  useEffect(() => {
    form.setValue('email', forwarder || '');
  }, [forwarder]);

  const onSubmit: SubmitHandler<ForwarderOptions> = async ({ email }) => {
    setIsLoading(true);
    const { message, success } = await updateForwarderAction({
      userId,
      email
    });
    if (success) {
      toast.success(message);
      onClose();
    }
    if (!success) {
      toast.error(message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant={'default'}
        className="w-full bg-transparent border rounded-full hover:text-white hover:bg-primary-base border-primary-base text-primary-base"
        type="button"
        onClick={() => onOpen()}
      >
        Forwarder
      </Button>
      {isOpen && (
        <ActionDialog
          openDialog={isOpen}
          closeDialog={() => {
            onClose();
            form.reset();
          }}
          title="Forwarder"
          // maxWidth="max-w-[350px]"
          formProps={form}
          description="A forwarder is your go-to email address for issue escalation."
          handleSubmit={form.handleSubmit(onSubmit)}
          creating={isLoading}
          disableCreate={isLoading}
          cancelText={'Cancel'}
          createText={'Save'}
          content={
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        type="email"
                        startIcon={Mail}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          }
          BtnVariant="error"
        />
      )}
    </>
  );
};

export const SettingsActionsPage = ({
  userId,
  paymentData,
  forwarder
}: SettingsActionsPageProps) => {
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h3 className="px-6 py-4 text-xl text-black sm:text-2xl dark:text-neutral-strong">
            Actions
          </h3>
          <p className="p-6 border-y border-surface-surface-normal">
            Actions supercharge your AI automated inbox. Share payment details,
            booking information, sync with your calendar — the possibilities are
            endless.
          </p>
        </div>
        <div className="flex flex-col gap-4 px-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-base text-black dark:text-neutral-strong">
              Default actions
            </h3>
            <p>Click on any action to set it up or make changes</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
            <SharePaymentCard userId={userId} paymentData={paymentData} />

            <ForwarderCard userId={userId} forwarder={forwarder} />
          </div>
        </div>

        <div className="flex flex-col h-full gap-4 px-6">
          <div className="flex flex-col gap-1">
            <h3 className="flex items-center gap-2 text-base text-[#050E14]">
              More actions{' '}
              <span className="px-2 text-[10px] border rounded-sm border-link text-link h-max">
                Coming soon
              </span>
            </h3>
            <p>Set up more actions</p>
          </div>
          <div className="flex flex-col gap-3 ">
            <Button
              variant={'ghost'}
              className="w-full rounded-full bg-[#050E140A] text-[#050E14] dark:text-neutral-weak"
              disabled
            >
              <FileText size={16} />
              <span className="flex-1 text-left">Send an invoice</span>
              <ArrowCircleRight />
            </Button>
            <Button
              variant={'ghost'}
              className="text-[#050E14] bg-[#050E140A] dark:text-neutral-weak rounded-full"
              disabled
            >
              <CalendarPlus size={16} />
              <span className="flex-1 text-left">Add to calendar</span>
              <ArrowCircleRight />
            </Button>
          </div>
          <Link href={'#'} className="text-primary-base">
            Create a custom action
          </Link>
        </div>
      </div>
    </>
  );
};
