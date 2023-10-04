import express from "express";
import bodyParser from "body-parser";
import router from "./src/routes.js";

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
  console.log("body", req.body);
});

app.use("/api/words", router);
// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.listen(8080, () => console.log("server is running on localhost:8080/"));
