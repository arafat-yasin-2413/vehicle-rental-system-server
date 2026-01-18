import { Router } from "express";
import { usersController } from "./users.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";

const router = Router();

router.get("/",auth(Roles.admin), usersController.getAllUser);  

export const usersRoutes = router;