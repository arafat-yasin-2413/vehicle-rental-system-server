import { Router } from "express";
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", auth("admin"), vehiclesController.addNewVehicle);
router.get("/", vehiclesController.getAllVehicles);
router.get("/:id", vehiclesController.getVehicleById);

export const vehiclesRoutes = router;
