import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { bookingsController } from "./bookings.controller";

const router = Router();

router.post("/", auth(Roles.admin, Roles.customer), bookingsController.addNewBooking);

export const bookingsRoutes = router;