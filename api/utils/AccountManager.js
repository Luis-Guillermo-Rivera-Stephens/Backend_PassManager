const AccountExistsByEmail = require('../queries/AccountExistsByEmail');
const AccountExistsById = require('../queries/AccountExistsByID');
const CreateAccount = require('../queries/CreateAccount');


class AccountManager {
    static async accountExistsByEmail(email, db) {
        try {
            const result = await db.query(AccountExistsByEmail, [email]);
            return result.rows[0];
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async accountExistsById(id, db) {
        try {
            const result = await db.query(AccountExistsById, [id]);
            return result.rows[0];
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async createAccount(account, db, emailManager) {
        try {
            await db.query("BEGIN");
            await db.query(CreateAccount, [account.email, account.password, account.createdAt, account.verified, account.type]);
            await emailManager.sendVerificationEmail(account.email);
            await db.query("COMMIT");
        } catch (error) {
            await db.query("ROLLBACK");
            return {
                error: error.message,
                success: false
            }
        }
    }
}
