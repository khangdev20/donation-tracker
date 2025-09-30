import { Router } from "express";
import AuthController from "../controllers/authController.js";
import authRequiredMiddleware from "../middleware/authRequiredMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { loginValidation, registerValidation } from "../utils/validation.js";

const router = Router();

router.post(
    "/register",
    registerValidation,
    validationMiddleware.handler,
    AuthController.registerUser.bind(AuthController)
);
router.post(
    "/login",
    loginValidation,
    validationMiddleware.handler,
    AuthController.loginUser.bind(AuthController)
);
router.get(
    "/profile",
    authRequiredMiddleware.handler,
    AuthController.getProfile.bind(AuthController)
);
router.put(
    "/profile",
    authRequiredMiddleware.handler,
    AuthController.updateProfile.bind(AuthController)
);

export default router;
