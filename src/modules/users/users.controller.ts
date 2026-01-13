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

export const usersController = {
    getAllUser,
};
