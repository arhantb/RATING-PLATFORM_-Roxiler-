import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { BadRequestError } from "../lib/error";

export const validate =
  (schema: ZodSchema<any>, type: "body" | "params" | "query" = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = schema.parse(req[type]);
        req[type] = data;
        next();
      } catch (err) {
        if (err instanceof Error) {
          next(new BadRequestError(err.message));
        } else {
          next(new BadRequestError("Invalid request"));
        }
      }
    };
