'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { logout } from '@/actions/server/auth';
import { updateMailbox } from '@/actions/server/mailbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/supabase/client';
import { Copy, Loader2, PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ProfilePageProps {
  fullname: string;
  email: string;
  initials: string;
  mailboxObjective: string;
  uniqueAddress: string;
  bio: string;
}

const updateProfileSchema = z.object({
  fullname: z.string().min(1, { message: 'Full name cannot be empty' }),
  objective: z
    .string()
    .min(2, { message: 'Mailbox objective cannot be empty' }),
  bio: z.string().min(2, { message: 'Bio cannot be empty' }),
});

type updateProfileOptions = z.infer<typeof updateProfileSchema>;

export const ProfilePage = ({
  fullname,
  mailboxObjective,
  uniqueAddress,
  bio,
  email,
  initials,
}: ProfilePageProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<updateProfileOptions>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullname, objective: mailboxObjective, bio },
  });

  const onSubmit: SubmitHandler<updateProfileOptions> = async ({
    fullname,
    objective,
    bio,
  }) => {
    setIsLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { message, success } = await updateMailbox({
      fullname,
      objective,
      uniqueAddress,
      bio,
      userId: user?.id ?? '',
    });

    setIsLoading(false);

    if (!success) {
      toast.error(message);
    } else if (success) {
      toast.success(message);
      setEditEnabled(false);
      router.refresh();
    }
  };

  const handleLogout = async (e: any) => {
    e.preventDefault();
    await logout();
    router.refresh();
  };

  const [editEnabled, setEditEnabled] = useState(false);

  const contactLink = `https://leadmark.email/contact-me/${uniqueAddress}`;

  const handleCopying = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard
          .writeText(contactLink)
          .then(() => toast.success('Contact link copied to clipboard'));
      } catch (error) {
        console.log(`Oops! I couldn't copy to clipboard because: ${error}`);
      }
    } else {
      document.execCommand('copy', true, contactLink);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full overflow-auto [&::-webkit-scrollbar]:hidden  sm:pb-4 pb-[100px] sm:max-w-[400px]">
      <div className="flex items-center justify-between gap-4 p-4 border-b border-[#0000000A]">
        <h3 className="text-xl font-medium text-white">Profile</h3>
        <Button
          variant={'ghost'}
          className={`flex items-center gap-1 py-0 h-0 -mr-3 text-sm text-primary-base hover:text-primary ${
            editEnabled ? 'text-[#D26656]' : ''
          }`}
          onClick={() => setEditEnabled((prev) => !prev)}
        >
          {!editEnabled ? 'Edit profile' : 'Cancel editing'}
          <PencilIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-row gap-4 border-b border-[#0000000A] px-4 pb-4 items-center justify-between">
        <div className="flex flex-col gap-1 ">
          {fullname ? (

            <h3 className="text-xl text-white sm:text-2xl ">
              {fullname}
            </h3>
            
          ) : (
            <Skeleton className="w-20 h-4 " />
          )}
          {email ? (
            <p className="text-primary">{email}</p>
          ) : (
            <Skeleton className="w-20 h-4 " />
          )}
        </div>
        <Avatar src="" label={initials} />

      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
            <div className="px-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={!editEnabled}
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="px-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (up to 240 characters)</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={!editEnabled}
                        placeholder="Enter your bio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex flex-col gap-1.5 border-b border-[#0000000A] px-4 pb-4">
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mailbox objective (up to 240 characters)
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly={!editEnabled}
                        placeholder="Enter your mailbox objective"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-start w-full gap-2">
                <p className="text-xs text-white">
                  This helps us customize your Leadmark experience to meet your
                  specific needs.
                </p>
              </div>
            </div>
            {editEnabled && (
              <div className="px-6">
                <Button
                  disabled={isLoading}
                  className="w-full text-white"
                  type="submit"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Save Profile Info'
                  )}{' '}
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 border-b border-[#0000000A] px-4 pb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base text-white ">
                Link
              </h3>
              <p>
                An exclusive link for easy contact. Put it on your website and
                stay connected effortlessly.
              </p>
            </div>
            {/* <LinkInput defaultValue={uniqueAddress} disabled /> */}

            <div>
              <div className="text-link w-full rounded-md border dark:border-white/20 border-[#00000029] bg-transparent px-4 py-3 text-sm flex justify-between items-center">
                <div>{contactLink}</div>
                <Copy
                  size={16}
                  onClick={() => handleCopying()}
                  className="cursor-pointer text-muted-foreground"
                />
              </div>
            </div>
          </div>
          <div className="w-full px-4">
            <Button
              variant="ghost"
              className="text-[#D26656] border-[#D26656] border w-full"
              type="button"
              onClick={handleLogout}
            >
              Logout
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.25 10.125C5.25 10.2245 5.21049 10.3198 5.14016 10.3902C5.06984 10.4605 4.97446 10.5 4.875 10.5H2.25C2.05109 10.5 1.86032 10.421 1.71967 10.2803C1.57902 10.1397 1.5 9.94891 1.5 9.75V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H4.875C4.97446 1.5 5.06984 1.53951 5.14016 1.60984C5.21049 1.68016 5.25 1.77554 5.25 1.875C5.25 1.97446 5.21049 2.06984 5.14016 2.14016C5.06984 2.21049 4.97446 2.25 4.875 2.25H2.25V9.75H4.875C4.97446 9.75 5.06984 9.78951 5.14016 9.85983C5.21049 9.93016 5.25 10.0255 5.25 10.125ZM10.3903 5.73469L8.51531 3.85969C8.44495 3.78932 8.34951 3.74979 8.25 3.74979C8.15049 3.74979 8.05505 3.78932 7.98469 3.85969C7.91432 3.93005 7.87479 4.02549 7.87479 4.125C7.87479 4.22451 7.91432 4.31995 7.98469 4.39031L9.21984 5.625H4.875C4.77554 5.625 4.68016 5.66451 4.60984 5.73484C4.53951 5.80516 4.5 5.90054 4.5 6C4.5 6.09946 4.53951 6.19484 4.60984 6.26517C4.68016 6.33549 4.77554 6.375 4.875 6.375H9.21984L7.98469 7.60969C7.91432 7.68005 7.87479 7.77549 7.87479 7.875C7.87479 7.97451 7.91432 8.06995 7.98469 8.14031C8.05505 8.21068 8.15049 8.25021 8.25 8.25021C8.34951 8.25021 8.44495 8.21068 8.51531 8.14031L10.3903 6.26531C10.4252 6.23049 10.4528 6.18913 10.4717 6.1436C10.4906 6.09808 10.5003 6.04928 10.5003 6C10.5003 5.95072 10.4906 5.90192 10.4717 5.8564C10.4528 5.81087 10.4252 5.76951 10.3903 5.73469Z"
                  fill="#D26656"
                />
              </svg>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
