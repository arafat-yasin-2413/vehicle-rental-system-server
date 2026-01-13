import express, { NextFunction, Request, Response } from "express";
import initDB from "./config/db";
import config from "./config";
import logger from "./middleware/logger";

// express app
const app = express();
const port = config.port;
// body parser
app.use(express.json());

// database setup
initDB();


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
