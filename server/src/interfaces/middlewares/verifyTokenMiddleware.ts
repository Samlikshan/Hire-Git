import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

interface UserPayload extends jwt.JwtPayload {
  id: string;
  role: "company" | "candidate" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export const verifyToken = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        res.status(401).json({ message: "Access token missing" });
        return;
      }

      const user = jwt.verify(accessToken, config.env.jwtSecret) as JwtPayload;
      req.user = {
        id: user.id,
        role: user.role,
      };

      next(); // Proceed to next middleware
      return;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });
        return;
      }
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  };
};
