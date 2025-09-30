import User from "./User.js";

class Participant extends User {
    #campaigns = [];
    #donations = [];

    constructor({ id, name, email, password }) {
        super({ id, name, email, password });
    }

    createCampaign(campaignData) {
        this.#campaigns.push(campaignData);
        return campaignData;
    }

    donate(campaignId, amount) {
        const donation = { campaignId, amount, date: new Date() };
        this.#donations.push(donation);
        return donation;
    }

    getCampaigns() {
        return this.#campaigns;
    }
    getDonations() {
        return this.#donations;
    }
}

export default Participant;
