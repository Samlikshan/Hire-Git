import { z } from "zod";

//regex
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const contactNumberRegex = /^[0-9]{10}$/;

//schemas
export const createCandidateSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        strongPasswordRegex,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is missing, please try again"),
    newPassword: z.string().min(1, "Password is required"),
  }),
});

export const createCompanySchema = z.object({
  body: z.object({
    companyName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        strongPasswordRegex,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }),
  contactNumber: z
    .string()
    .regex(contactNumberRegex, "Contact number must be exactly 10 digits"),
  industry: z.string().min(1, "industry is required"),
  headquarters: z.string().min(1, "headquarters is required"),
});

// export type CreateUserDTO = z.infer<typeof createUserSchema>["body"];
