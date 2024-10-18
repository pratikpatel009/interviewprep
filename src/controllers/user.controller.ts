import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import ApiError from "../utils/apiError";
import catchAsync from "../utils/catchAsync";
import { ApiResponse } from "../utils/apiResponse";


const generateAccess = async (userId: unknown) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user?.generateAccessToken();
  
      return accessToken;
    } catch (error) {
      throw new ApiError(
        "Something went wrong while generating referesh and access token",
        500
      );
    }
  };

  export const signup = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password , mobile} = req.body;
  

    if (!name || !email || !password || !mobile) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
  
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
  
  
    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
    });

    const getUser = await User.findById(newUser._id).select(
      "-password -createdAt -updatedAt -__v"
    );
  
    return res
      .status(201)
      .json(new ApiResponse(200, getUser, "User register Successfully"));
  });

  export const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, mobile, password } = req.body;
  
    if (!email) {
      throw new ApiError(" email is required", 400);
    }
  
    const user = await User.findOne({
      $or: [{ mobile }, { email }],
    });
  
    if (!user) {
      throw new ApiError("User does not exist", 404);
    }

    console.log("user ", user);
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    console.log("isPasswordValid", isPasswordValid);
  
    if (!isPasswordValid) {
      throw new ApiError("Invalid user password", 401);
    }
  
    const accessToken = await generateAccess(user._id);
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -createdAt -updatedAt -__v"
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
          },
          "User logged In Successfully"
        )
      );
  });

