'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type AppFormValues, appFormSchema } from '@/lib/validations/app';

type Props = {
  appId?: string;
};

const EditAppForm = ({ appId }: Props) => {
  const router = useRouter();

  const form = useForm<AppFormValues>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      name: '',
      apiKey: '',
    },
  });

  const { data: app, isLoading } = useQuery({
    queryKey: ['app', appId],
    queryFn: async () => {
      const response = await fetch(`/api/app/${appId}`);
      if (!response.ok) throw new Error('Failed to fetch app');
      return response.json();
    },
  });

  useEffect(() => {
    if (app) {
      form.reset(app);
    }
  }, [app, form]);

  const mutation = useMutation({
    mutationFn: async (values: AppFormValues) => {
      const response = await fetch(`/api/app/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Failed to update app');
      return response.json();
    },
    onSuccess: () => {
      toast.success('App updated successfully');
      router.push(`/dashboard/${appId}`);
    },
    onError: () => {
      toast.error('Failed to update app');
    },
  });

  const onSubmit = (values: AppFormValues) => {
    mutation.mutate(values);
  };

  if (isLoading || !appId) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit App</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditAppForm;
