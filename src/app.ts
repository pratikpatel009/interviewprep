import express,{ Request,Response,NextFunction } from "express";
import cookieParser from "cookie-parser"
import ApiError from "./utils/apiError";
import globalErrorHandler from "./utils/appError";



const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

import userRouter from "./routes/user.routes"
import planRouter from "./routes/plan.routes"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/plans",planRouter)

app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export { app }




