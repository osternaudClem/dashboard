'use client';

import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateProjectApp } from '@/lib/react-query/appQueries';

const appSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  projectId: z.string().min(1, 'Project ID is required'),
});

const NewApp = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const { mutateAsync: createApp } = useCreateProjectApp();

  const form = useForm<z.infer<typeof appSchema>>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: '',
      projectId: projectId || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof appSchema>) => {
    try {
      const response = await createApp(data);

      if (!response.id) {
        return;
      }

      router.push(`/project/${projectId}/app/${response.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New App</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div>
            <Button type="submit">Create App</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewApp;
