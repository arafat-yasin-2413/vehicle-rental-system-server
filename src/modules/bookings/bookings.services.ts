import { pool } from "../../config/db";

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

const allBookings = async () => {
    const resutl = await pool.query(`SELECT * FROM bookings`);
    return resutl;
};

export const bookingsServices = {
    addNewBooking,
    allBookings,
};
