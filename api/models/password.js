class Password {
    constructor(id, name, password, updateableByClient, visibility = true) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.updateableByClient = updateableByClient;
        this.visibility = visibility;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            password: this.password,
            updateableByClient: this.updateableByClient,
            visibility: this.visibility
        }
    }
}