import { validationResult } from "express-validator";
import { Middleware } from "./Middleware.js";

class ValidationMiddleware extends Middleware {
    static async handler(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationErrors = errors.array().map((error) => ({
                field: error.type === "field" ? error.path : "unknown",
                message: error.msg,
            }));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                validationErrors,
                errorType: "validation",
            });
        }
        return next();
    }
}

export default ValidationMiddleware;
