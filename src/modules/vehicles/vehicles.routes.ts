import { Router } from "express";
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", auth("admin"), vehiclesController.addNewVehicle);
router.get("/", vehiclesController.getAllVehicles);
router.get("/:vehicleId", vehiclesController.getVehicleById);
router.put("/:vehicleId", auth("admin"), vehiclesController.updateVehicleById);
router.delete("/:vehicleId", auth("admin"), vehiclesController.deleteVehicleById);

export const vehiclesRoutes = router;
