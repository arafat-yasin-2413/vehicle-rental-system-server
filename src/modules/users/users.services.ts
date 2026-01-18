import { pool } from "../../config/db";

const getAllUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);

    return result;
};

const updateUserProfile = async(id:string, loggedInUserData:Record <string, unknown>, payload : Record <string, unknown>) =>{
    // console.log('I am from user.service file --- update user profile\n', id,"\n",loggedInUserData, "\n", "Payload data \n", payload);


    // At first CHECK if the user exist (with "id");
    const matchedUser = await pool.query(`SELECT * FROM users WHERE id=$1`,[id]);
    console.log("$$$$$$$$ Printing MatchedUser : ", matchedUser.rowCount, matchedUser.rows[0]);

    if(matchedUser.rowCount === 0) {
        throw new Error(`No User Found with userId = ${id}`);
    }

    

    // Role === Admin
    // Admin can update all fields

    // Role === Customer

    // i) can't update the role



    return "result string";
}

export const usersServices = {
    getAllUser,
    updateUserProfile,
};
