class ApiKeyManager {
    static VerifyApiKey(api_key) {
        if (api_key === process.env.APIKEY_ADMIN) {
            return process.env.APIKEY_ID_ADMIN;
        }
        if (api_key === process.env.APIKEY_CLIENT) {
            return process.env.APIKEY_ID_CLIENT;
        }
        return null;
    }
}

module.exports = ApiKeyManager;