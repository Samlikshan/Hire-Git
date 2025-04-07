import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { HttpStatus } from "../../domain/enums/http-status.enum";

export const companyMiddleware = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        res.status(403).json({ message: "Access token missing" });
        return;
      }

      const user = jwt.decode(accessToken) as JwtPayload;
      if (user.role != "company") {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Company only access" });
        return;
      }

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
