const GetAllPasswordsAsAClient = require('../queries/GetAllPasswordsAsAClient');
const { PasswordSummary } = require('../models/password');
const GetPasswordByIdAsAClient = require('../queries/GetPasswordByIDAsAClient');
const GetAllPasswords = require('../queries/GetAllPasswords');
const PasswordExistByIDAndAccountID = require('../queries/PasswordExistByIDAndAccountID');
const GetPasswordById = require('../queries/GetPasswordByID');
const { Password } = require('../models/password');

class PasswordGetter {
    static async GetAllPasswords(account_id, credentials = false, offset = 0, limit = 10, db, search = '') {
        let query = GetAllPasswordsAsAClient	;
        if (credentials) {
            query = GetAllPasswords;
        }

        try {
            const result = await db.query(query, [account_id, offset, limit, search]);
            const passwords = PasswordSummary.FromResult(result);
            return {
                data: passwords,
                total: result.rowCount,
                success: true
            }

        } catch (error) {
            console.log('PasswordGetter: error getting all passwords:', error);
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async GetPasswordById(id, account_id, db, credentials = false) {
        let query = GetPasswordByIdAsAClient;
        if (credentials) {
            query = GetPasswordById;
        }
        try {
            const result = await db.query(query, [id, account_id]);
            const password = Password.FromResult(result);
            return {
                data: password,
                total: result.rowCount,
                success: true
            }
        } catch (error) {
            console.log('PasswordGetter: error getting password by id:', error);
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async PasswordExistByIDAndAccountID(id, account_id, db) {
        try {
            const result = await db.query(PasswordExistByIDAndAccountID, [id, account_id]);
            return {
                exists: result.rows[0] ? true : false,
                data: result.rows[0],
                success: true
            }
        } catch (error) {
            console.log('PasswordGetter: error checking if password exists:', error);
            return {
                error: error.message,
                success: false
            }
        }
    }
}

module.exports = PasswordGetter;