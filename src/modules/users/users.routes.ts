import { Router } from "express";
import { usersController } from "./users.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";

const router = Router();

router.get("/",auth(Roles.admin), usersController.getAllUser);  
router.put("/:userId", auth(Roles.admin, Roles.customer), usersController.updateUserProfile);
router.delete("/:userId", auth(Roles.admin), usersController.deleteUser);

export const usersRoutes = router;