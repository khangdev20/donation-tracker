class CampaignFactory {
    static fromRequest(body) {
        const {
            title,
            description,
            goalAmount,
            currency,
            deadline,
            imageUrl,
            createdBy,
            createdAt,
            updatedAt,
        } = body;
        return {
            title: title.trim(),
            description: description,
            goalAmount: Number(goalAmount),
            currency: currency,
            deadline: deadline,
            imageUrl: imageUrl,
            createdBy: createdBy,
            createdAt: createdAt,
            updatedAt: updatedAt,
        };
    }
}

export default CampaignFactory;
