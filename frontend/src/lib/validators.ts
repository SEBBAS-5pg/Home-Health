import { z } from "zod";

/** HU01 - Registro de usuario */
export const registerSchema = z
  .object({
    fullName: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Correo electrónico no válido"),
    phone: z
      .string()
      .min(7, "Teléfono no válido")
      .regex(/^[\d\s+()-]+$/, "Solo números y símbolos válidos"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Za-z]/, "Debe incluir al menos una letra")
      .regex(/\d/, "Debe incluir al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/** HU02 - Inicio de sesión */
export const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo electrónico no válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginInput = z.infer<typeof loginSchema>;
