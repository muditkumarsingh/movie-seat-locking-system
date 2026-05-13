import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";



export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //default response
    let statusCode = err.status|| err.statusCode ||500;
    let message = "Something went worng!";
    let errors :{
        field?: string;
        message:string;
    }[] = [];

    //Zod error handling
    if(err instanceof ZodError){
        statusCode=400;
        message="Validation Error";
        errors = err.errors.map((e)=>({
            field:e.path.join('.'),
            message:e.message
        }))
    }else if(err instanceof Error){
        message = err.message
    }

    res.status(statusCode).json({
        success:false,
        message,
        errors
    })
}