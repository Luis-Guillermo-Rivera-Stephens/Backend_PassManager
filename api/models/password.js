class Password {
    constructor(id, name, description, password, updateableByClient, visibility = true) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.password = password;
        this.updateableByClient = updateableByClient;
        this.visibility = visibility;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            password: this.password,
            updateableByClient: this.updateableByClient,
            visibility: this.visibility
        }
    }
}