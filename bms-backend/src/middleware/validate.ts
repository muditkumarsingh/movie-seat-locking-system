

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";


export const validate =
    (schema: AnyZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = schema.parse(req.body);
                next()
            } catch (error) {
                next(error)
            }

        };