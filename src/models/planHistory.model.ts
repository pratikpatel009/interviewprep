import mongoose from "mongoose";

export interface IPlanHistory extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    plan: mongoose.Types.ObjectId;
    amount: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PlanHistorySchema = new mongoose.Schema<IPlanHistory>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);  

export const PlanHistory = mongoose.model<IPlanHistory>("PlanHistory", PlanHistorySchema);
