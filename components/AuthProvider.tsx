"use client";

import { SessionProvider } from "next-auth/react";
import { BalanzaProvider } from "@/context/BalanzaContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BalanzaProvider>{children}</BalanzaProvider>
    </SessionProvider>
  );
}
