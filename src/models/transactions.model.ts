import mongoose from "mongoose";

export interface ITransction extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    plan: mongoose.Types.ObjectId;
    amount: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransction>(
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
        type: {
            type: String,
            required: true,
        },
    },          
    {
        timestamps: true,
    })

    export const Transaction = mongoose.model<ITransction>("Transaction", TransactionSchema);
