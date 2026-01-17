import { Router } from "express";
import { usersController } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/",auth(), usersController.getAllUser);

export const usersRoutes = router;