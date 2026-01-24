import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const getAllUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);

    return result;
};

const updateUserProfile = async (
    id: string,
    loggedInUserData: Record<string, unknown>,
    payload: Record<string, unknown>,
) => {
    // console.log('Logged in user : ', loggedInUserData);
    // console.log("Hit update User Api : Printing Payload Data : \n", payload);

    // At first CHECK if the user exist (with "id");
    const matchedUser = await pool.query(`SELECT id,name,email,phone,role FROM users WHERE id=$1`, [id]);

    if (matchedUser.rowCount === 0) {
        throw new Error(`No User Found with userId = ${id}`);
    }

    const targetedUser = matchedUser.rows[0];

    // Logged in User's role is customer
    if (loggedInUserData.role !== "admin") {
        const paramsId = Number(id);
        // delete payload.role;

        if (loggedInUserData.id !== paramsId) {
            throw new Error("You are not allowed to update other user's profile.");
        }

        if (payload.role !== "customer") {
            throw new Error("You are Customer. So that You Cannot Update Your Role.");
        }

        // now update here
        let hashedPassword = "";
        if (payload.password) {
            hashedPassword = await bcrypt.hash(payload.password as string, 12);
        }

        const result = await pool.query(
            `UPDATE users SET name=$1, email=$2, password=$3, phone=$4 WHERE id=$5 RETURNING name, email, phone, role`,
            [payload.name, payload.email, hashedPassword, payload.phone, id],
        );
        return result;
    }

    const hashedPasswordByAdmin = await bcrypt.hash(payload.password as string, 12);
    const result = await pool.query(
        `UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING name, email, phone, role`,
        [payload.name, payload.email, hashedPasswordByAdmin, payload.phone, payload.role, id],
    );
    return result;
};

const deleteUser = async (userId:string) =>{
    const isValidUser = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`,[userId]);
    // console.log('Printing isValid User rowcount: ', isValidUser.rowCount);
    if(isValidUser.rowCount === 0) {
        throw new Error(`This User (id= ${userId}) Has No Instance in Booking Table. Try with another userId.`);
    }

    const activeBooking = await pool.query(`SELECT 1 FROM bookings WHERE customer_id=$1 AND status='active' LIMIT 1`,[userId]);

    // console.log('Printing activeBooking rowcount : ', activeBooking.rowCount);

    if(activeBooking.rowCount as number > 0) {
        throw new Error(`This User (id = ${userId}) Has Active Bookings. Can't be Deleted.`);
    }

    const result = await pool.query(`DELETE FROM users WHERE id=$1`,[userId]);
    return result;
}

export const usersServices = {
    getAllUser,
    updateUserProfile,
    deleteUser,
};
