"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanySchema = exports.resetPasswordSchema = exports.loginSchema = exports.createCandidateSchema = void 0;
const zod_1 = require("zod");
//regex
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const contactNumberRegex = /^[0-9]{10}$/;
//schemas
exports.createCandidateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(strongPasswordRegex, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, "Email is required").email("Invalid email"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is missing, please try again"),
        newPassword: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.createCompanySchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(strongPasswordRegex, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
    }),
    contactNumber: zod_1.z
        .string()
        .regex(contactNumberRegex, "Contact number must be exactly 10 digits"),
    industry: zod_1.z.string().min(1, "industry is required"),
    headquarters: zod_1.z.string().min(1, "headquarters is required"),
});
// export type CreateUserDTO = z.infer<typeof createUserSchema>["body"];
