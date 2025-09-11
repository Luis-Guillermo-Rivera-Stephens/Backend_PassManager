class TwoFactorAuthentication {
    constructor(accountId, secret, createdAt = new Date(), isEnabled = false) {
        this.accountId = accountId;
        this.secret = secret;
        this.createdAt = createdAt;
        this.isEnabled = isEnabled;
    }

    toJSON() {
        return {
            accountId: this.accountId,
            secret: this.secret,
            createdAt: this.createdAt,
            isEnabled: this.isEnabled
        }
    }
}