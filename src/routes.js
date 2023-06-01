import {
  createLocation,
  getLocation,
  deleteLocation,
  updateLocation,
  getAllLocations,
} from "./controllers/location.js";
import {
  getAlltemperatures,
  gettemperaturesWithDate,
  dummy,
} from "./controllers/temperature.js";
import { Router } from "express";

const router = Router();

//Location CRUD routes
router.post("/addLocation", createLocation);
router.get("/getLocation", getLocation);
router.delete("/deleteLocation", deleteLocation);
router.put("/updateLocation", updateLocation);
router.get("/getAllLocations", getAllLocations);

//temperature GET routes
router.get("/getAllTemperatures", getAlltemperatures);
router.get("/getTemperaturesWithDate", gettemperaturesWithDate);
router.get("/dummy", dummy);
export default router;
