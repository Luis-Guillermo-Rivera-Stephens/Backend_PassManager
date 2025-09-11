class Password {
    constructor(id, name, password, updateableByClient, visible = true) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.updateableByClient = updateableByClient;
        this.visible = visible;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            password: this.password,
            updateableByClient: this.updateableByClient,
            visible: this.visible
        }
    }

}