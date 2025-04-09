import jwt from "jsonwebtoken";
import config from "../config";

interface JwtPayload {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  contactNumber?: number;
  industry?: string;
  registrationDocument?: string;
  headquarters?: string;
  role?: "candidate" | "company" | "admin";
}

interface EmailVerificationPayload {
  id: string;
  name: string;
  email: string;
  password: string;
  contactNumber?: number;
  industry?: string;
  registrationDocument?: string;
  headquarters?: string;
}

export class JwtService {
  constructor() {}

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.env.jwtSecret, { expiresIn: "7d" });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.env.jwtSecret, { expiresIn: "7d" });
  }

  generateVerificationToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.env.jwtSecret, { expiresIn: "30m" });
  }

  verifyToken(token: string): EmailVerificationPayload | null {
    try {
      return jwt.verify(
        token,
        config.env.jwtSecret
      ) as EmailVerificationPayload;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, config.env.jwtSecret) as JwtPayload;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
