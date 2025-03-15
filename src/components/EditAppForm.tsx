'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
  useDeleteProjectApp,
  useGetAppById,
  useUpdateProjectApp,
} from '@/lib/react-query/appQueries';
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

  const { data: app, isLoading } = useGetAppById(appId || '');
  const { mutateAsync: updateApp, isPending } = useUpdateProjectApp(appId || '');
  const { mutateAsync: deleteApp, isPending: isDeletePending } = useDeleteProjectApp();

  useEffect(() => {
    if (app) {
      form.reset(app);
    }
  }, [app, form]);

  const onSubmit = async (values: AppFormValues) => {
    try {
      const response = await updateApp(values);

      if (!response.id) throw new Error('Failed to update app');
      toast.success('App updated successfully');
      router.push(`/project/${app?.projectId}/app/${appId}`);
    } catch {
      toast.error('Failed to update app');
    }
  };

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (!appId) throw new Error('App ID is missing');

      const response = await deleteApp(appId);

      if (!response.id) {
        throw new Error('Failed to delete app');
      }

      toast.success('App deleted successfully');
      router.push(`/project/${app?.projectId}`);
    } catch {
      toast.error('Failed to delete app');
    }
  }, [app?.projectId, appId, deleteApp, router]);

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
            <div className="flex justify-between">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete App
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this app and remove
                      all associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeletePending}>
                      {!isDeletePending ? 'Yes, delete it!' : 'Deleting...'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditAppForm;
