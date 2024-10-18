import mongoose from "mongoose";

export interface IPlan extends mongoose.Document {
  name: string;
  amount: number;
  ROI: number;
  duration: number;
}

const PlanSchem = new mongoose.Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    ROI: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model<IPlan>("Plan", PlanSchem);
