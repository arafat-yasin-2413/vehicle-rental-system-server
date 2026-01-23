import { Result } from "pg";
import { pool } from "../../config/db";
import separateDate from "../../utils/separateDate";

const addNewBooking = async (payload: Record<string, unknown>, loggedInUserData: Record<string, unknown>) => {
    // console.log("Vehicle booking Payload : ", payload);

    console.log('Logged in user data in booking.service : ', loggedInUserData);

    const vehicle = await pool.query(
        `SELECT daily_rent_price FROM vehicles WHERE id=$1 AND availability_status='available'`,
        [payload.vehicle_id],
    );

    // console.log('\nVehicle from query : ', vehicle.rowCount , "\n",vehicle.rows);
    //  [ { daily_rent_price: '7000' } ]

    if (vehicle.rowCount === 0) {
        throw new Error("Vehicle Not Available");
    }

    const dailyRentPrice = Number(vehicle.rows[0].daily_rent_price);
    // console.log('price per day : ', dailyRentPrice, typeof dailyRentPrice);

    const startDate = new Date(payload.rent_start_date as string);
    const endDate = new Date(payload.rent_end_date as string);

    const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // console.log('diffDays : ', diffDays , typeof diffDays);

    if (diffDays <= 0) {
        throw new Error("Invalid date range is given.");
    }

    const totalPrice = diffDays * dailyRentPrice;


    if(loggedInUserData.role !== "admin") {
        if(loggedInUserData.id !== payload.customer_id) {
            throw new Error("You are a customer. You cannot Add New Booking for another cutomer.")
        }
    }


    const result = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [payload.customer_id, payload.vehicle_id, payload.rent_start_date, payload.rent_end_date, totalPrice, "active"],
    );

    await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [payload.vehicle_id]);

    return result;
};

const allBookings = async (payload: Record<string, unknown>) => {


    // console.log('Logged in user data in allBooking services : ', payload);

    if(payload.role !== 'admin') {
        const myBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [payload.id]);
        return myBookings;
    }



    const result = await pool.query(`SELECT * FROM bookings`);
    return result;
};

const updateBooking = async(bookingId: string, loggedInUserData: Record<string, unknown>) =>{
    // console.log('Booking Id received : ', bookingId);
    console.log('Current LoggedInUser : ', loggedInUserData);

    const matchedBooking = await pool.query(`SELECT * FROM bookings WHERE id=$1`,[bookingId]);
    
    // Work for Any Role
    if(matchedBooking.rowCount === 0) {
        throw new Error(`No booking data found for bookingId : ${bookingId}`);
    }

    console.log('Printing matched bookings : \n', matchedBooking.rowCount, "\n,", matchedBooking.rows[0]);
    
    const bookingData = matchedBooking.rows[0];

    const currentDateOnly = separateDate(new Date()) as string;
    const rentStartDateOnly = separateDate(new Date(bookingData.rent_start_date)) as string;

    // Customer Role
    if(loggedInUserData.role !== 'admin') {
        
        if(currentDateOnly >= rentStartDateOnly ) {
            throw new Error("Booking already started, Cannot Cancel");
        }
        else {
            if(bookingData.status !== 'active'){
                throw new Error(`This Booking Data Cannot be Updated. It is in ${bookingData.status} state`);
            }
            else if(bookingData.status === 'active') {
                const updateResult = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,['cancelled',bookingId]);
                return updateResult;
            }

        }
        
    }

    // admin Role
    else{
        // step 1 : ei bookingId er data ante hobe
        const currentBookingData = await pool.query(`SELECT * FROM bookings WHERE id=$1`,[bookingId]);
        console.log('Current booking data : ', currentBookingData.rows[0]);

        if(currentBookingData.rows[0].status !== 'cancelled') {
            throw new Error(`This booking data can't be updated by admin though. Because it is already in ${currentBookingData.rows[0].status} state.`);
        }

        const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,['returned',bookingId]);
        await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`,['available',bookingData.vehicle_id]);
        // step 2 : ei booking data er status diye check korte hobe
        return result;
    }

    
    
}


export const bookingsServices = {
    addNewBooking,
    allBookings,
    updateBooking,
};
