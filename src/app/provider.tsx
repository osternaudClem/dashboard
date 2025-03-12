'use client';

import { SessionProvider } from 'next-auth/react';

import { QueryProvider } from '@/lib/react-query/QueryProvider';

export default function Prodiver({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
}
