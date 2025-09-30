import { compare, genSalt, hash } from "bcrypt";
import { Schema, model } from "mongoose";

const PaymentMethodSchema = new Schema(
    {
        provider: { type: String, enum: ["stripe"], default: "stripe" },
        stripePaymentMethodId: { type: String },
        brand: String,
        last4: String,
        expMonth: Number,
        expYear: Number,
        country: String,
        isDefault: { type: Boolean, default: false },
        addedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: { type: String, required: true },
        address: { type: String, trim: true },

        role: {
            type: String,
            enum: ["admin", "participant"],
            default: "participant",
        },

        stripeCustomerId: {
            type: String,
            index: true,
            sparse: true,
            default: null,
        },

        paymentMethods: {
            type: [PaymentMethodSchema],
            default: [],
            validate: {
                validator(arr) {
                    return (arr?.filter((pm) => pm.isDefault).length || 0) <= 1;
                },
                message: "Only one default payment method is allowed.",
            },
        },

        status: {
            type: String,
            enum: ["active", "blocked", "pending"],
            default: "active",
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.password;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("isAdmin").get(function () {
    return this.roles?.includes("admin");
});
userSchema.virtual("isParticipant").get(function () {
    return this.roles?.includes("participant");
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return compare(candidatePassword, this.password);
};

userSchema.methods.setDefaultPaymentMethod = function (stripePaymentMethodId) {
    if (!this.paymentMethods?.length) return;
    this.paymentMethods.forEach((pm) => {
        pm.isDefault = pm.stripePaymentMethodId === stripePaymentMethodId;
    });
};

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: String(email).toLowerCase().trim() });
};

userSchema.statics.findByEmailWithPassword = function (email) {
    return this.findOne({ email: String(email).toLowerCase().trim() }).select(
        "+password"
    );
};

const User = model("User", userSchema);
export default User;
