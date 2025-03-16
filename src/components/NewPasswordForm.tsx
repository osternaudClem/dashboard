'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { resetPassword } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const formSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type NewPasswordFormProps = {
  className?: string;
  token?: string;
};

const NewPasswordForm = ({ className, token }: NewPasswordFormProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleNewPassword = async (values: z.infer<typeof formSchema>) => {
    setError('');
    setIsLoading(true);
    await resetPassword(
      {
        ...values,
        token: token as string,
      },
      {
        onError: (ctx) => {
          setError(ctx.error.message);
        },
        onSuccess: () => {
          router.push('/login');
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
          <CardDescription>Enter your details below to create a new account</CardDescription>
        </CardHeader>

        <CardContent>
          {!token ? (
            <div>No token found!</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleNewPassword)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.newPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <div>
                  <Button type="submit" className="w-full" loading={isLoading}>
                    Save new password
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  <Link href="/login" className="underline underline-offset-4">
                    Back to sign in
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPasswordForm;
