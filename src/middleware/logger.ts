import { NextFunction, Request, Response } from "express";

// logger middleware
const logger = (req:Request, res:Response, next:NextFunction) =>{
    console.log('You have entered in the Logger Middleware');
    console.log(`Time : [${new Date().toISOString()}] --- Method : [${req.method}] --- Path : "${req.path}"`);
    next();
}

export default logger;