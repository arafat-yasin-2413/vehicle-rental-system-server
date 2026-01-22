import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";
import { JwtPayload } from "jsonwebtoken";


const addNewBooking = async (req: Request, res: Response) => {
    try {
        // console.log('Printing logged in user from booking controller : ', req.user);
        const loggedInUserData = req.user as JwtPayload;
        const result = await bookingsServices.addNewBooking(req.body, loggedInUserData);
        console.log('Result in booking controller : ', result.rows[0]);

        return res.status(201).json({
            success: true,
            message: "New Booking Created in Database",
            data: result.rows[0],
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const allBookings = async(req:Request, res: Response) =>{
    try{
        const result = await bookingsServices.allBookings();
        console.log('All Bookings : ', result);

        return res.status(200).json({
            success: true,
            message: "Successfully Returned All Bookings",
            data: result.rows,
        })
    }
    catch(error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const bookingsController = {
    addNewBooking,
    allBookings,
}