import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
    {
        donation: {
            type: Schema.Types.ObjectId,
            ref: "Donation",
            index: true,
        },
        campaignId: {
            type: Schema.Types.ObjectId,
            ref: "Campaign",
            index: true,
        },

        checkoutSessionId: { type: String, required: true, unique: true },
        chargeId: { type: String },
        customerId: { type: String },
        paymentMethodId: { type: String },

        status: {
            type: String,
            enum: [
                "pending",
                "requires_action",
                "processing",
                "succeeded",
                "failed",
                "canceled",
            ],
            required: true,
            index: true,
        },
        amount: { type: Number, required: true, min: 0 },
        currency: {
            type: String,
            default: "AUD",
            uppercase: true,
        },
        paidAt: { type: Date },
        reason: { type: String },

        cardBrand: String,
        cardLast4: String,
    },
    { timestamps: true }
);

transactionSchema.index({ paymentIntentId: 1 });
transactionSchema.index({ fundingNeed: 1, createdAt: -1 });

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
