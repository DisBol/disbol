"use server";

import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Credenciales inválidas" };
    }

    return { success: true };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Error al iniciar sesión" };
  }
}
