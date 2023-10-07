import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import bodyParser from "body-parser";
import router from "./src/routes.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((request: Request, response: Response, next: NextFunction) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// Test route
app.post("/", (request: Request, response: Response, next: NextFunction) => {
  console.log("bodyxx", request.body);
});

app.use("/api/words", router);
// Error handling
app.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    console.log("Is this the error", error);
    const status = response.statusCode || 500;
    const message = error.message;
    response.status(status).json({ message: message });
  }
);

app.listen(8080, () => console.log("server is running on localhost:8080/"));
