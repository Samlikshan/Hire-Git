import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { Message } from "../../domain/entities/Message";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessage = err.errors[0]?.message || "Validation error";
        res.status(400).json({ message: errorMessage });
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ message: errorMessage });
    }
  };
