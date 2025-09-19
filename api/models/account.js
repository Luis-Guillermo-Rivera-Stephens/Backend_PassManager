const uuid = require('uuid');

class Account {
    constructor(id = uuid.v4(), name, email, password, created_at = new Date(), started, verified = false, type = 'client') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
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
            created_at: this.created_at,
            type: this.type,
            started: this.started,
            verified: this.verified
        }
    }

    static newAccount(name, email, password, type) {
        const now = new Date();
        console.log('🔍 Account: newAccount - created_at:', now);
        console.log('🔍 Account: newAccount - created_at ISO:', now.toISOString());
        return new Account(uuid.v4(), name, email, password, now, false, false, type);
    }
}

module.exports = Account;