import CampaignFactory from "../factories/CampaignFactory.js";
import Campaign from "../models/Campaign.js";
import CampaignRepository from "../repositories/CampaignRepository.js";
import DonationRepository from "../repositories/donationRepository.js";

class CampaignController {
    constructor() {
        this._campaignRepository = new CampaignRepository();
        this._donationRepository = new DonationRepository();
    }

    async createCampaign(req, res) {
        try {
            const campaignData = CampaignFactory.fromRequest(req.body);
            const campaign = await this._campaignRepository.create(
                campaignData
            );
            res.status(201).json({
                success: true,
                message: "Campaign created successfully",
                campaign,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create campaign",
                error: error.message,
            });
        }
    }

    async getCampaigns(req, res) {
        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        try {
            const [campaigns, total] = await Promise.all([
                this._campaignRepository.find(
                    {
                        title: { $regex: search, $options: "i" },
                    },
                    {
                        populate: "createdBy",
                        skip: (page - 1) * limit,
                        limit: limit,
                        sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
                    }
                ),
            ]);
            res.status(200).json({
                success: true,
                total,
                page,
                limit,
                data: campaigns,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to get campaigns",
                error: error.message,
            });
        }
    }

    async getCampaignById(req, res) {
        const { id } = req.params;
        try {
            const campaign = await Campaign.findById(id).populate("createdBy");
            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    message: "Campaign not found",
                });
            }

            res.status(200).json({
                success: true,
                data: campaign,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to get campaign by id",
                error: error.message,
            });
        }
    }

    async getDonorsByCampaignId(req, res) {
        const { campaignId } = req.params;
        const {
            page = 1,
            limit = 10,
            sortBy = "amount",
            sortOrder = "desc",
        } = req.query;
        try {
            const donors = await this._donationRepository.findWithPagination(
                { campaignId: campaignId },
                page,
                limit,
                {
                    populate: "donor",
                    sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
                }
            );
            const total = await this._donationRepository.count({
                campaignId: campaignId,
            });
            res.status(200).json({
                success: true,
                data: donors,
                total,
                page,
                limit,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new CampaignController();
