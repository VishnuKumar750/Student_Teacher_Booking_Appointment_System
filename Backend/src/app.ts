import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import ratelimit from "express-rate-limit";
import { HTTP_STATUS } from "./config/http.config";
import globalErrorHandler from "./middleware/Error.middleware";
import cookieParser from "cookie-parser";

const app: Application = express();

// middleware
dotenv.config();

const allowedOrigins = [config.PRODUCTION_ORIGIN, config.LOCAL_ORIGIN];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many request from this IP, Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

import authRoutes from "@/modules/auth/auth.routes";
import appointmentRoutes from "@/modules/appointments/appointment.routes";
import userRouter from "@/modules/user/user.routes";
import { config } from "./config/app.config";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/user", userRouter);

// other routes - not found
app.all("/", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    sucess: false,
    message: "route not found",
  });
});

app.use(globalErrorHandler);

export default app;
