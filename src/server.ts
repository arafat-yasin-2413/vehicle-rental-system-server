import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), '.env')});
const app = express();
const port = process.env.PORT;
// body parser
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.CONNECTION_STR,
});

const initDB = async () => {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE CHECK (email = LOWER(email)), 
                password VARCHAR(250) NOT NULL CHECK (LENGTH(password) >= 6),
                phone VARCHAR(15) NOT NULL,
                role VARCHAR(100) NOT NULL CHECK (role IN ('admin', 'customer'))
            )
        `);
    
        await pool.query(` 
                CREATE TABLE IF NOT EXISTS vehicles(
                    id SERIAL PRIMARY KEY,
                    vehicle_name VARCHAR(200) NOT NULL,
                    type VARCHAR(100) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
                    registration_number VARCHAR(100) NOT NULL UNIQUE,
                    daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
                    availability_status VARCHAR(15) NOT NULL CHECK (availability_status IN ('available', 'booked'))
                )
            `);
        
            await pool.query(`
                    CREATE TABLE IF NOT EXISTS bookings(
                        id SERIAL PRIMARY KEY,
                        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
                        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
                        rent_start_date DATE NOT NULL,
                        rent_end_date DATE NOT NULL,
                        total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
                        status VARCHAR(30) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
                        CHECK (rent_end_date > rent_start_date)
                    );
                `);
        
};

initDB();






app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
});

app.post("/", (req: Request, res: Response) => {
    console.log(req.body);

    res.status(200).json({
        success: true,
        message: "Post API is working",
    });
});


// Not found route
app.use((req:Request, res:Response)=>{
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    });
});

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
