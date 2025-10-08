const AccountExistsByEmail = require('../queries/AccountExistsByEmail');
const AccountExistsById = require('../queries/AccountExistsByID');
const CreateAccount = require('../queries/CreateAccount');
const SearchAccounts = require('../queries/SearchAccounts');
const VerifyAccount = require('../queries/VerifyAccount');


class AccountManager {
    static async accountExistsByEmail(email, db) {
        try {
            const result = await db.query(AccountExistsByEmail, [email]);
            console.log('AccountManager: accountExistsByEmail: result', result.rows[0]);
            return {
                success: true,
                account: result.rows[0],
                exists: result.rows[0] ? true : false
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async accountExistsByID(id, db) {
        try {
            const result = await db.query(AccountExistsById, [id]);
            console.log('AccountManager: accountExistsByID: result', result.rows[0]	);
            return {
                success: true,
                account: result.rows[0],
                exists: result.rows[0] ? true : false
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async createAccount(account, db, emailManager, token) {
        try {
            console.log('🔍 AccountManager: createAccount starting...');
            
            await db.query("BEGIN");
            
            const params = [account.id, account.name, account.email, account.password, account.created_at, account.verified, account.type, account.twofaenabled, account.salt];
            console.log('🔍 AccountManager: query parameters:', params);
            
            await db.query(CreateAccount, params);
            
            // Intentar enviar el email de verificación
            const emailResult = await emailManager.sendVerificationEmail(account.email, token);
            if (!emailResult.success) {
                console.log('❌ AccountManager: failed to send verification email, rolling back account creation');
                await db.query("ROLLBACK");
                return {
                    error: `Account created but failed to send verification email: ${emailResult.error}`,
                    success: false
                };
            }
            
            await db.query("COMMIT");
            
            console.log('✅ AccountManager: account created successfully');
            return {
                success: true,
                message: 'Account created successfully'
            };
        } catch (error) {
            console.log('❌ AccountManager: error creating account:', error);
            await db.query("ROLLBACK");
            
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async verifyAccount(id, db) {
        try {
            await db.query(VerifyAccount, [id]);
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async deleteAccount(id, db) {
        try {
            await db.query(DeleteAccount, [id]);
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async searchAccounts(search, offset, limit, db) {
        try {
            const result = await db.query(SearchAccounts, [search, offset, limit]);
            return {
                success: true,
                accounts: result.rows,
                count: result.rowCount
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }
}

module.exports = AccountManager;