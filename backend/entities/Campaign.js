class Campaign {
    constructor(
        id,
        title,
        description,
        goalAmount,
        currency,
        deadline,
        imageUrl,
        createdBy,
        createdAt,
        updatedAt
    ) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._goalAmount = goalAmount;
        this._currency = currency;
        this._deadline = deadline;
        this._imageUrl = imageUrl;
        this._createdBy = createdBy;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    getProgressPercent() {
        if (this._goalAmount === 0) return 0;
        return Math.min((this._currentAmount / this._goalAmount) * 100, 100);
    }

    _getDaysLeft() {
        return Math.ceil(
            (new Date(this._deadline) - new Date()) / (1000 * 60 * 60 * 24)
        );
    }

    _isExpired() {
        return this._getDaysLeft() < 0;
    }

    getStatus() {
        if (this._isExpired()) return "expired";
        if (this._getDaysLeft() <= 7) return "closing soon";
        return "active";
    }

    setCurrentAmount(amount) {
        this._currentAmount = amount;
        this._updatedAt = new Date();
    }

    setBackers(backers) {
        this._backers = backers;
    }
}

export default Campaign;
