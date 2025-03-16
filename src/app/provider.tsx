'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/react-query/QueryProvider';

const queryClient = new QueryClient();

const Prodiver = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <QueryProvider>
          {children}

          <Toaster />
        </QueryProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Prodiver;
