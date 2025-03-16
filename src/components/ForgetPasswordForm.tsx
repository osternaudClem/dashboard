'use client';

import Link from 'next/link';
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
import { Input } from '@/components/ui/input';
import { forgetPassword } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgetPasswordFormType = {
  className?: string;
};

const ForgetPasswordForm = ({ className = '' }: ForgetPasswordFormType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgetPassword = async (values: z.infer<typeof formSchema>) => {
    setError('');
    setIsLoading(true);
    await forgetPassword(
      {
        ...values,
        redirectTo: '/reset-password',
      },
      {
        onSuccess: () => {
          setShowSuccessMessage(true);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
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
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email below to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="destructive">{error}</Alert>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForgetPassword)} className="space-y-4">
              {showSuccessMessage ? (
                <Alert variant="success">
                  <AlertDescription>
                    A password reset link has been sent to your email address.
                  </AlertDescription>
                </Alert>
              ) : null}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <div>
                <Button type="submit" className="w-full" loading={isLoading}>
                  Ask new password
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                <Link href="/signup" className="underline underline-offset-4">
                  Back to the login page
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPasswordForm;
