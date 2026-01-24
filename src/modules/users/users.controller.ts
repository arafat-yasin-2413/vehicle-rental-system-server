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
        const loggedInUserData = req.user!;

        const result = await usersServices.updateUserProfile(req.params.userId as string, loggedInUserData, req.body)

        return res.status(200).json({
            success: true, 
            message: "Update done",
            data: result.rows[0]
        });
    }
    catch(err:any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const deleteUser = async(req: Request, res: Response) =>{
    try{
        const userId = req.params.userId;

        const result = await usersServices.deleteUser(userId as string);

        return res.status(200).json({
            success: true, 
            message: "User Deleted Successfully",
            data: result.rows
        });
    }
    catch(err:any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const usersController = {
    getAllUser,
    updateUserProfile,
    deleteUser,
};
