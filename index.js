import express from "express";
import bodyParser from "body-parser";
import router from "./routes.js";
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
app.use("/location", router);

// Temprature GET routes
app.use("/temprature", router);

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.listen(8080, () => console.log("Listening on port 8080"));
// cron.schedule("*/30 * * * * *", () => {
//   updateTemperatures();
// });

// client
//   .connect()
//   .then(() => console.log("Connected successfully"))
//   .catch((err) => console.log(err))
//   .then(() => client.query("SELECT * FROM location"))
//   .then((res) => console.log(res.rows))
//   .finally(() => client.end());
