'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/react-query/QueryProvider';

const queryClient = new QueryClient();

export default function Prodiver({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <QueryProvider>
            {children}

            <Toaster />
          </QueryProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
