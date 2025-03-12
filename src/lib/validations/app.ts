import * as z from 'zod';

export const appFormSchema = z.object({
  name: z.string().min(2, {
    message: 'App name must be at least 2 characters.',
  }),
  apiKey: z.string(),
});

export type AppFormValues = z.infer<typeof appFormSchema>;
