const uuid = require('uuid');

class Account {
    constructor(id = uuid.v4(), name, email, password, createdAt = new Date(), started, verified = false, type = 'client') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.started = started;
        this.verified = verified;
        this.type = type;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,	
            email: this.email,
            password: this.password,
            createdAt: this.createdAt,
            verified: this.verified
        }
    }

    static newAccount(name, email, password, type) {
        return new Account(uuid.v4(), name, email, password, new Date(), false, false, type);
    }
}

module.exports = Account;