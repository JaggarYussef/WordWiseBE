import express from "express";
import bodyParser from "body-parser";
import router from "./src/routes.js";
import updateTemperatures from "./src/controllers/utils/temperatureUpdater.js";
// import updateTemperatures from "./controllers/utils/temperatureUpdater.js";
import cron from "node-cron";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// Test route
app.get("/", (req, res, next) => {
  res.send("Hello World");
});

// Location CRUD routes
app.use("/api/location", router);

// Temprature GET routes
app.use("/api/temprature", router);

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.listen(8080, () => console.log("server is running"));
cron.schedule("8 1 * * *", () => {
  updateTemperatures();
});
