import { Request, Response } from "express";
import { Plan } from "../models/plan.model";
import catchAsync from "../utils/catchAsync";
import { ApiResponse } from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import { PlanHistory } from "../models/planHistory.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Transaction } from "../models/transactions.model";

export const createPlan = catchAsync(async (req: Request, res: Response) => {
  const plan = new Plan(req.body);
  const savedPlan = await plan.save();
  res
    .status(201)
    .json(new ApiResponse(201, savedPlan, "Plan created successfully"));
});

// Get all plans
export const getPlans = catchAsync(async (req: Request, res: Response) => {
  const plans = await Plan.find();
  res
    .status(200)
    .json(new ApiResponse(200, plans, "Plans retrieved successfully"));
});

// Get a single plan by ID
export const getPlanById = catchAsync(async (req: Request, res: Response) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    throw new ApiError("Plan not found", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, plan, "Plan retrieved successfully"));
});

// Update a plan by ID
export const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!plan) {
    throw new ApiError("Plan not found", 404);
  }
  res.status(200).json(new ApiResponse(200, plan, "Plan updated successfully"));
});

// Delete a plan by ID
export const deletePlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await Plan.findByIdAndDelete(req.params.id);
  if (!plan) {
    throw new ApiError("Plan not found", 404);
  }
  res.status(200).json(new ApiResponse(200, plan, "Plan deleted successfully"));
});

export const purchasePlan = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { planId } = req.body;

    // Fetch the plan details
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new ApiError("Plan not found", 404);
    }

    // Calculate the start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + plan.duration);

    // Create a new plan history
    const planHistory = new PlanHistory({
      user: req.user?._id,
      plan: planId,
      amount: plan.amount,
      startDate: startDate,
      endDate: endDate,
    });

    const savedPlanHistory = await planHistory.save();

    const createTranscations = await Transaction.create({
      user: req.user?._id,
      plan: planId,
      amount: plan.amount,
      type: "Credit",
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, savedPlanHistory, "Plan purchased successfully")
      );
  }
);
