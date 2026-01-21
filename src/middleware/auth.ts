import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            // console.log("---------- token from auth.ts file -----------");
            // console.log({ authToken: token });

            // now CHECK if the token has arrived
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "You are not Authorized",
                });
            }

            // Otherwise, DECODE the "token"
            const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
            // console.log("\n ------- Printing Decoded --------\n", decoded);
            req.user = decoded;

            if(roles.length && !roles.includes(decoded.role)){
                throw new Error("You are Not AUTHORIZED");
            }

            next();

        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };
};

export default auth;
