import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const addNewVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.addNewVehicle(req.body);
        console.log('------ Printing at vehicles-controller ------- \n', result.rows[0]);

        return res.status(201).json({
            success: true,
            message: "New Vehicle Created in Database",
            data: result.rows[0],
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getAllVehicles();
        console.log('------ Printing at vehicles-controller ------- \n', result.rows);

        return res.status(200).json({
            success: true,
            message: "Got All Vehicles",
            data: result.rows,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const vehiclesController = {
    addNewVehicle,
    getAllVehicles,
};
