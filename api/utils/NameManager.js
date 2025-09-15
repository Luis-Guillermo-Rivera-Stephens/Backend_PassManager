const AvaliableName = require('../queries/AvaliableName');

class NameManager {
    static ValidateName(name) {
        const regex = /^[a-zA-Z\s@._-]+$/;
        return regex.test(name);
    }
    static SanitizeName(name) {
        return name.trim();
    }

    static async isAvailableName(name, db) {
        try {
            const result = await db.query(AvaliableName, [name]);
            return {exists: result.rows[0]};
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }
}

module.exports = NameManager;