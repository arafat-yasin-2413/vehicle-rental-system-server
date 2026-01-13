import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signUpUser = async (req: Request, res: Response) => {
	try {
		const result = await authServices.signUpUser(req.body);
		// console.log('result ---' ,result);

	 	return res.status(201).json({
			success: true,
			message: "User Created",
			data: result.rows[0],
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};



export const authController = {
    signUpUser,
};