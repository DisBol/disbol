"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/Button";

export function LogoutButton() {
  return (
    <Button
      variant="primary"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Cerrar Sesión
    </Button>
  );
}
