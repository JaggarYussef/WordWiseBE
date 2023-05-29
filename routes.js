import {
  createLocation,
  getLocation,
  deleteLocation,
  updateLocation,
  getAllLocations,
} from "./controllers/location.js";
import {
  getAllTempratures,
  getTempraturesWithDate,
  dummy,
} from "./controllers/temprature.js";
import { Router } from "express";

const router = Router();

//Location CRUD routes
router.post("/addLocation", createLocation);
router.get("/getLocation", getLocation);
router.delete("/deleteLocation", deleteLocation);
router.put("/updateLocation", updateLocation);
router.get("/getAllLocations", getAllLocations);

//Temprature GET routes
router.get("/getAllTempratures", getAllTempratures);
router.get("/getTempraturesWithDate", getTempraturesWithDate);
router.get("/dummy", dummy);
export default router;
