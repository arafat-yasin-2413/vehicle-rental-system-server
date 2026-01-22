import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const getAllUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);

    return result;
};

const updateUserProfile = async (id: string, loggedInUserData: Record<string, unknown>, payload: Record<string, unknown>) => {
    // console.log('Logged in user : ', loggedInUserData);

    // At first CHECK if the user exist (with "id");
    const matchedUser = await pool.query(`SELECT id,name,email,phone,role FROM users WHERE id=$1`, [id]);

    if (matchedUser.rowCount === 0) {
        throw new Error(`No User Found with userId = ${id}`);
    }

    const targetedUser = matchedUser.rows[0];
    // console.log('targetedUser = ', targetedUser, "\n loggedInUserData.role = ", loggedInUserData.role);

    // Logged in User's role is customer
    if (loggedInUserData.role !== "admin") {
        const paramsId = Number(id);
        delete payload.role;

        if (loggedInUserData.id !== paramsId) {
            // console.log('Payload after validation : ', payload);
            // console.log('log id : ', typeof loggedInUserData.id, "\n params id : ", typeof paramsId);
            throw new Error("You are not allowed to update other user's profile.");
        }

        // now update here
        // console.log("Payload after validation : ", payload);
        let hashedPassword = "";
        if (payload.password) {
            hashedPassword = await bcrypt.hash(payload.password as string, 12);
        }

        const result = await pool.query(`UPDATE users SET name=$1, email=$2, password=$3, phone=$4 WHERE id=$5 RETURNING name, email, phone, role`, [
            payload.name,
            payload.email,
            hashedPassword,
            payload.phone,
            id,
        ]);
        return result;
    }

    const hashedPasswordByAdmin = await bcrypt.hash(payload.password as string, 12);
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING name, email, phone, role`, [
        payload.name,
        payload.email,
        hashedPasswordByAdmin,
        payload.phone,
        payload.role,
        id,
    ]);
    return result;
};

export const usersServices = {
    getAllUser,
    updateUserProfile,
};
