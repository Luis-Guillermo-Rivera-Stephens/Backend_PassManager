class Password {
    constructor(id, name, description, password, updateableByClient, visibility = true, account_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.password = password;
        this.updateableByClient = updateableByClient;
        this.visibility = visibility;
        this.account_id = account_id;

    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            password: this.password,
            updateableByClient: this.updateableByClient,
            visibility: this.visibility,
            account_id: this.account_id
        }
    }

    static FromResult(result) {
        return new Password(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].password, result.rows[0].updateableByClient, result.rows[0].visibility, result.rows[0].account_id);
    }
}

class PasswordSummary {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
   
        }
    }

    static FromResult(result) {
        let passwords = [];
        for (let i = 0; i < result.rows.length; i++) {
            passwords.push(new PasswordSummary(result.rows[i].id, result.rows[i].name, result.rows[i].description));
        }
        return passwords;
    }
}


module.exports = { Password, PasswordSummary };
