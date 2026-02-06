import express from "express";
import morgan from "morgan";
import { NotFoundError } from "./lib/error";
import { errorHandler } from "./lib/error.handler";
import cors from "cors";
import router from "./routes/routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

app.get("/healthz", (_req, res) => {
  res.status(200).json({
    status: "healthy",
  });
});

app.use(router);


app.use((_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

app.listen(4000, () => console.log("Server Running on port 4000!"));
