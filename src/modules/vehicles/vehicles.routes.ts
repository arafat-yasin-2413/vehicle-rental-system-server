import { Router } from "express";
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";
import { Roles } from "../auth/auth.constant";

const router = Router();

router.post("/", auth(Roles.admin), vehiclesController.addNewVehicle);
router.get("/", vehiclesController.getAllVehicles);
router.get("/:vehicleId", vehiclesController.getVehicleById);
router.put("/:vehicleId", auth(Roles.admin), vehiclesController.updateVehicleById);
router.delete("/:vehicleId", auth(Roles.admin), vehiclesController.deleteVehicleById);

export const vehiclesRoutes = router;
