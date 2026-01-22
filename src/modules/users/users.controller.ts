import { Request, Response } from "express";
import { usersServices } from "./users.services";

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.getAllUser();

        return res.status(200).json({
            success: true,
            message: "Got All User",
            data: result.rows,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateUserProfile = async(req:Request, res:Response) =>{
    try{
        // const id = req.params.userId;
        const loggedInUserData = req.user!;


        // console.log('printing from try block ', id);
        // console.log('******Printing the loggedin user details******* \n', req.user!);
        const result = await usersServices.updateUserProfile(req.params.userId as string, loggedInUserData, req.body)
        console.log('Printing updated result ---- \n', result.rows);

        return res.status(200).json({
            success: true, 
            message: "Update done"
        });
    }
    catch(err:any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const usersController = {
    getAllUser,
    updateUserProfile,
};
