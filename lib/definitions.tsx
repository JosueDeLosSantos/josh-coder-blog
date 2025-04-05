import { z } from "zod";

export type User = {
  id: string;
  firstname: string;
  surname: string;
  name: string;
  email: string;
  password: string;
  bio: string | null;
  image?: string;
  created_at: Date;
};

export const SignupFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  surname: z
    .string()
    .min(2, { message: "Surname must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Must contain at least one special character.",
    })
    .trim(),
});

export const UpdateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  surname: z
    .string()
    .min(2, { message: "Surname must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  bio: z.string().optional(),
});

export const UpdatePasswordSchema = z.object({
  password: z
    .string()
    .regex(/[a-zA-Z]/)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/)
    .trim(),
  new_password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Must contain at least one special character.",
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        firstName?: string[];
        surname?: string[];
        email?: string[];
        password?: string[];
        new_password?: string[];
        bio?: string[];
      };
      message?: string;
    }
  | undefined;

export type Message = {
  id: string;
  message: string;
  date: Date;
  name: string;
  image: string;
};
