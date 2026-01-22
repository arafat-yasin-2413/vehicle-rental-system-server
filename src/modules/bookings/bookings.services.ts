import { pool } from "../../config/db";

const addNewBooking = async (payload: Record<string, unknown>) => {
    // const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    // const result = await pool.query(`INSERT INTO bookings() VALUES($1,$2,$3,$4,$5) RETURNING *`, [

    // ]);
    console.log("Vehicle booking Payload : ", payload);

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

    const result = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6)`,
        [payload.customer_id, payload.vehicle_id,payload.rent_start_date, payload.rent_end_date,totalPrice,'active']
    );

    await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`,[payload.vehicle_id]);

    return result;
};

export const bookingsServices = {
    addNewBooking,
};
