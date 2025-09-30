import { Schema, model } from "mongoose";

const campaignSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    goalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    backers: {
        type: Number,
        default: 0,
        min: 0,
    },
    currency: {
        type: String,
        default: "AUD",
        uppercase: true,
    },
    deadline: {
        type: Date,
    },
    imageUrl: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

campaignSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

campaignSchema.methods.getProgressPercent = function () {
    if (this.goalAmount === 0) return 0;
    return Math.min((this.currentAmount / this.goalAmount) * 100, 100);
};

const Campaign = model("Campaign", campaignSchema);

export default Campaign;
