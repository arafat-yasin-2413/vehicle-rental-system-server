import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";
import { JwtPayload } from "jsonwebtoken";

const addNewBooking = async (req: Request, res: Response) => {
    try {
        // console.log('Printing logged in user from booking controller : ', req.user);
        const loggedInUserData = req.user as JwtPayload;
        const result = await bookingsServices.addNewBooking(req.body, loggedInUserData);
        console.log("Result in booking controller : ", result.rows[0]);

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

const allBookings = async (req: Request, res: Response) => {
    try {
        const loggedInUserData = req.user as JwtPayload;

        const result = await bookingsServices.allBookings(loggedInUserData);
        // console.log("All Bookings : ", result);

        // TODO: rowCount could be zero
        if(result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `No bookings data has been found for this customer id = ${loggedInUserData.id}`,
                data: null,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Successfully Returned All Bookings",
            data: result.rows,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const updateBooking = async(req: Request, res:Response) =>{
    try{
        const loggedInUserData = req.user as JwtPayload;
        const bookingId = req.params.bookingId;
        // console.log('Printing Booking Id : ', bookingId);

        const result = await bookingsServices.updateBooking(bookingId as string, loggedInUserData);
        console.log('printing updateBooking.controller result : ', result?.rows);

        return res.status(200).json({
            success: true,
            message: "Booking Updated Successfully",
            data: result
        })
    }

    catch(error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const bookingsController = {
    addNewBooking,
    allBookings,
    updateBooking,
};
