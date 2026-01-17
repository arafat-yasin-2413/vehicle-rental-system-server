import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        // console.log("---------- token from auth.ts file -----------");
        // console.log({ authToken: token });
        
        // now CHECK if the token has arrived
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "You are not Authorized"
            })
        } 

        // Otherwise, DECODE the "token"
        const decoded = jwt.verify(token, config.jwtSecret as string)
        console.log("\n ------- Printing Decoded --------\n", decoded);
        req.user = decoded as JwtPayload;
        next();
    };
};

export default auth;