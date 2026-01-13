import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
// import { pool } from "../../database/db";

const signUpUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    const hashedPassword = await bcrypt.hash(password as string, 12);

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
        [name, email, hashedPassword, phone, role]
    );

    // console.log("Result : ---", result);
    // delete result.rows[0].password;

    return result;
};

export const authServices = {
    signUpUser,
};
