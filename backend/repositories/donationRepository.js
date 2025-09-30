import Donation from "../models/Donation.js";
import BaseRepository from "./baseRepository.js";

class DonationRepository extends BaseRepository {
    constructor() {
        super(Donation);
    }
    async findByUserId(userId) {
        return this._model.find({ userId });
    }
}

export default DonationRepository;
