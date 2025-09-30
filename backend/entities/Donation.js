class Donation {
    constructor({
        id,
        amount,
        currency,
        campaignId,
        userId,
        name,
        email,
        isAnonymous,
        paidAt,
        transactionId,
    }) {
        this._id = id;
        this._amount = amount;
        this._currency = currency;
        this._campaignId = campaignId;
        this._userId = userId;
        this._name = name;
        this._email = email;
        this._isAnonymous = isAnonymous;
        this._paidAt = paidAt;
        this._transactionId = transactionId;
    }
}

export default Donation;
