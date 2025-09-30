import { Router } from "express";
import CampaignController from "../controllers/campaignController.js";
import authRequiredMiddleware from "../middleware/authRequiredMiddleware.js";
import requiredRolesMiddleware from "../middleware/requiredRolesMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { createCampaignValidation } from "../utils/validation.js";

const router = Router();

router.post(
    "/",
    authRequiredMiddleware.handler,
    requiredRolesMiddleware.with("participant", "admin"),
    createCampaignValidation,
    validationMiddleware.handler,
    CampaignController.createCampaign.bind(CampaignController)
);
router.get("/", CampaignController.getCampaigns.bind(CampaignController));
router.get("/:id", CampaignController.getCampaignById.bind(CampaignController));
router.get(
    "/:campaignId/donors",
    authRequiredMiddleware.handler,
    requiredRolesMiddleware.with("participant", "admin"),
    CampaignController.getDonorsByCampaignId.bind(CampaignController)
);

export default router;
