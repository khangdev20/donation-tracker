import { Middleware } from "./Middleware.js";

class RequiredRolesMiddleware extends Middleware {
    static with(...roles) {
        return async (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    status: "error",
                    message: "Access denied",
                });
            }
            next();
        };
    }
}

export default RequiredRolesMiddleware;
