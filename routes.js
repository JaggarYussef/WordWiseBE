import {
  createLocation,
  getLocation,
  deleteLocation,
  updateLocation,
  getAllLocations,
} from "./controllers/location.js";

import { Router } from "express";

const router = Router();

//Location CRUD routes
router.post("/addLocation", createLocation);
router.get("/getLocation", getLocation);
router.delete("/deleteLocation", deleteLocation);
router.put("/updateLocation", updateLocation);
router.get("/getAllLocations", getAllLocations);

export default router;
