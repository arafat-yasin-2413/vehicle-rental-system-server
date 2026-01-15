import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";

const signUpUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    if ((password as string).length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }

    const hashedPassword = await bcrypt.hash(password as string, 12);

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
        [name, email, hashedPassword, phone, role]
    );

    // console.log("Result : ---", result);
    // delete result.rows[0].password;

    return result;
};

const signInUser = async (payload: Record<string, unknown>) => {
    const { email, password } = payload;
    // search the user by email in the db
    const isUserMatched = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    );

    // console.log('Password from req : pass: ', password, typeof(password));
    // console.log(
    //     'Printing auth.service.signInUser "isMatched": ',
    //     isUserMatched.rows[0]
    // );
    // console.log('\n------------------------------------------------------------')
    
    // console.log("\n");
    // User not exist with that email
    if (isUserMatched.rows.length === 0) {
        throw new Error("User not matched. Provide CORRECT email");
    }

    const user = isUserMatched.rows[0];
    // console.log("Printing user in auth.service.signInUser : USER: ", user);

    // comparing the password
    const isPasswordMatch = await bcrypt.compare(
        password as string,
        user.password
    );

    // console.log("************************************************\n")
    // console.log('Printing "ispasswordmatch" : ', isPasswordMatch);
    // console.log("***********************************************\n")

    // password not matched
    if (!isPasswordMatch) {
        throw new Error("Invalid password. Try Again with CORRECT Password");
    }


    const secret = process.env.SECRET;

    const token = jwt.sign({ name: user.name, email: user.email }, secret as string, {
        expiresIn: "7d",
    });

    console.log({ token });

    delete user.password;
    return { user, token };
};

export const authServices = {
    signUpUser,
    signInUser,
};
