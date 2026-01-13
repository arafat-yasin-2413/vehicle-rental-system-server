import { pool } from "../../config/db";

const getAllUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);

    return result;
};

export const usersServices = {
    getAllUser,
};
