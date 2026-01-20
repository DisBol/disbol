// features/auth/schemas/login.schema.ts
import * as v from "valibot";

export const loginSchema = v.object({
  username: v.pipe(v.string(), v.minLength(1, "El usuario es obligatorio")),

  password: v.pipe(v.string(), v.minLength(1, "La contraseña es obligatoria")),
});

export type LoginSchema = v.InferOutput<typeof loginSchema>;
