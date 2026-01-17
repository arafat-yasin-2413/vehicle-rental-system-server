import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const addNewVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.addNewVehicle(req.body);
        console.log("------ Printing at vehicles-controller ------- \n", result.rows[0]);

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
        console.log("------ Printing at vehicles-controller ------- \n", result.rows);

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

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicleById(req.params.vehicleId as string);
        // console.log(
        //     "------ Printing at vehicles-controller ------- \n",
        //     result.rowCount,
        // );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `Vehicle Not Found With id = ${req.params.vehicleId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Got Vehicle by given id in the params.",
            data: result.rows[0],
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateVehicleById = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    try {
        const result = await vehiclesServices.updateVehicleById(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId as string);
        // console.log(result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle Not Found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle Updated Successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const vehiclesController = {
    addNewVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicleById,
};
