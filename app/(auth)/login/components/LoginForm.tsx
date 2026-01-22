"use client";

import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";

import { loginSchema, type LoginSchema } from "../schemas/login.schema";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: valibotResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    console.log("LOGIN DATA", data);
    // aquí va tu auth
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <InputField
        label="Usuario"
        placeholder="Ingresa tu usuario"
        {...register("username")}
        error={errors.username?.message}
      />

      <InputField
        label="Contraseña"
        type="password"
        placeholder="Ingresa tu contraseña"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button type="submit" variant="primary">
        Ingresar
      </Button>
    </form>
  );
}
