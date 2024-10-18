import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      "";

    if (!token) {
      throw new ApiError("Unauthorized request", 401);
    }
    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );

    const user: IUser = await User.findById(decodedToken?._id).select(
      "-password -createdAt -updatedAt"
    );

    if (!user) {
      throw new ApiError("Invalid Access Token or User does not exist", 401);
    }

    req.user = user;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError("Invalid Access Token", 401);
    }
    if (!roles.includes(req.user?.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
