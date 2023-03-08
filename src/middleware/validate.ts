import { NextFunction,Request,Response } from "express";
import { AnyZodObject, ZodError } from "zod";
const validate =(schema:AnyZodObject)=>(req:Request,res:Response,next:NextFunction)=>{
    try {
        schema.parse({
            body:req.body,
            params:req.params,
            query:req.query,
            headers:req.headers


        })
    } catch (error) {
        const zoderror=error as ZodError;
        return res.status(400).json({
            message:zoderror.errors[0].message,
        });
        
    }
next();
};
export default validate;