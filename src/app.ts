import express, { NextFunction, Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";

// express app
const app = express();

// body parser
app.use(express.json());

// database setup
initDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);

app.get("/", logger, (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});

export default app;
