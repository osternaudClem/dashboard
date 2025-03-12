"use client";

import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { SessionProvider } from "next-auth/react";

export default function Prodiver({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
}
