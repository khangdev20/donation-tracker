import Campaign from "../models/Campaign.js";
import BaseRepository from "./baseRepository.js";

class CampaignRepository extends BaseRepository {
    constructor() {
        super(Campaign);
    }
}

export default CampaignRepository;
