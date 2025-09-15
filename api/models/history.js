class History {
    constructor(password_id, account_id, updatedAt = new Date(), value, name) {
        this.password_id = password_id;
        this.account_id = account_id;
        this.updatedAt = updatedAt;
        this.value = value;
        this.name = name;
    }
    toJSON() {
        return {
            password_id: this.password_id,
            account_id: this.account_id,
            updatedAt: this.updatedAt,
            value: this.value,
            name: this.name
        }
    }
}