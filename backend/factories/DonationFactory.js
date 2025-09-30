class DonationFactory {
    static fromRequest(body) {
        const {
            amount,
            currency,
            campaignId,
            userId,
            name,
            email,
            isAnonymous,
            paidAt,
            transactionId,
        } = body;
        return {
            amount: Number(amount),
            currency: currency,
            campaignId: campaignId,
            userId: userId,
            name: name,
            email: email,
            isAnonymous: isAnonymous,
            paidAt: paidAt,
            transactionId: transactionId,
        };
    }
}

export default DonationFactory;
