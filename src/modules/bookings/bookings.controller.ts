import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";


const addNewBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.addNewBooking(req.body);
        console.log('Result in booking controller : ', result.rows[0]);

        return res.status(201).json({
            success: true,
            message: "New Booking Created in Database",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const bookingsController = {
    addNewBooking,
}