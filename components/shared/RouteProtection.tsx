"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransactionRole } from "@/app/(auth)/login/hooks/useTransactionRole";

interface RouteProtectionProps {
  children: React.ReactNode;
  requiredTransaction: string;
  fallbackRoute?: string;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
  </div>
);

export function RouteProtection({
  children,
  requiredTransaction,
  fallbackRoute = "/dashboard",
}: RouteProtectionProps) {
  const { data: session, status } = useSession();
  const { hasAccess, loading } = useTransactionRole();
  const router = useRouter();

  const isLoading = status === "loading" || loading;

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!hasAccess(requiredTransaction)) {
      router.push(fallbackRoute);
      return;
    }
  }, [
    session,
    hasAccess,
    requiredTransaction,
    fallbackRoute,
    router,
    isLoading,
  ]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const isAuthorized = session && hasAccess(requiredTransaction);

  return isAuthorized ? <>{children}</> : null;
}
