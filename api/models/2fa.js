class TwoFactorAuthentication {
    constructor(accountId, secret, createdAt = new Date()) {
        this.accountId = accountId;
        this.secret = secret;
        this.createdAt = createdAt;
    }

    toJSON() {
        return {
            accountId: this.accountId,
            secret: this.secret,
            createdAt: this.createdAt
        }
    }
}

module.exports = TwoFactorAuthentication;