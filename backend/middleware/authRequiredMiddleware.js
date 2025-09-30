import User from "../models/User.js";
import { JwtUtils } from "../utils/security.js";
import { Middleware } from "./Middleware.js";

class AuthRequiredMiddleware extends Middleware {
    static async handler(req, res, next) {
        try {
            const auth = req.headers.authorization || "";
            const hasBearer = auth.startsWith("Bearer ");
            const token = hasBearer ? auth.split(" ")[1] : null;

            if (!token) {
                return res
                    .status(401)
                    .json({ message: "Not authorized, no token" });
            }

            try {
                const decoded = JwtUtils.verifyToken(token);
                const user = await User.findById(decoded.id).select(
                    "+roles -password"
                );
                if (!user) {
                    return res
                        .status(401)
                        .json({ message: "Not authorized, user not found" });
                }
                req.user = user;
                return next();
            } catch (e) {
                return res
                    .status(401)
                    .json({ message: "Not authorized, token failed" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default AuthRequiredMiddleware;
