import express, { Application, Request, Response, NextFunction } from "express";
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
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

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

import adminRoutes from "@/routes/admin.routes";
import authRoutes from "@/routes/auth.routes";
import appointmentRoutes from "@/routes/appointment.routes";
import teacherRoutes from "@/routes/teacher.routes";
import studentRoutes from "@/routes/student.routes";

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/teacher", teacherRoutes);

// other routes - not found
app.all("/", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    sucess: false,
    message: "route not found",
  });
});

app.use(globalErrorHandler);

export default app;
