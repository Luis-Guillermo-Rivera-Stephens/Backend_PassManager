const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const PasswordNameIsAvailable = require('../queries/PasswordNameIsAvailable');
const CreatePassword = require('../queries/CreatePassword');
const DeletePassword = require('../queries/DeletePassword');

const AES_KEY = process.env.AES_KEY;

class PasswordManager {

    static ValidateStrongPassword(password) {
        if (!password || typeof password !== 'string') return false;
        password = this.SanitizePassword(password);
        if (password === '') return false;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/;
        return regex.test(password);
    }

    static SanitizePassword(password) {
        return password.trim();
    }

    static SanitizeValue(value) {
        if (typeof value !== 'string') return value;
        return value.trim();
    }

    static ValidateDescription(description) {
        if (!description || typeof description !== 'string') return false;
        description = this.SanitizeValue(description);
        if (description === '') return false;
        if (description.length > 500) return false; // Límite de caracteres
        return true;
    }

    static ValidatePasswordValue(password) {
        if (!password || typeof password !== 'string') return false;
        password = this.SanitizePassword(password);
        if (password === '') return false;
        return true;
    }

    static async EncryptPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    static async ComparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    
    static HidePassword(password, key) {
        return CryptoJS.AES.encrypt(password, key).toString();
    }

    static ShowPassword(password, key) {
        return CryptoJS.AES.decrypt(password, key).toString(CryptoJS.enc.Utf8);
    } 


    static ValidatePasswordName(name) {
        if (!name || name.length < 3 || name.length > 100 || typeof name !== 'string') return false;
        name = this.SanitizePasswordName(name);
        if (name === '') return false;
        const regex = /^[a-zA-Z\s@._\-0-9]+$/;
        return regex.test(name);
    }

    static SanitizePasswordName(name) {
        return name.trim();
    }

    static ValidateUpdateableByClient(updateablebyclient) {
        if (updateablebyclient !== true && updateablebyclient !== false) return false;
        return true;
    }

    static ValidateVisibility(visibility) {
        if (visibility !== true && visibility !== false) return false;
        return true;
    }

    static async PasswordNameIsAvailable(name, account_id, db) {
        try {
            const result = await db.query(PasswordNameIsAvailable, [name, account_id]);
            return {
                exists: result.rows[0].exists,
                data: result.rows[0],
                success: true
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async createPassword(password, db) {
        try {
            const result = await db.query(CreatePassword, [password.id, password.name, password.description, password.password, password.updateablebyclient, password.visibility, password.account_id]);
            return {
                data: result.rows[0],
                success: true
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async deletePassword(id, account_id, db) {
        try {
            console.log("id", id);
            console.log("account_id", account_id);
            const result = await db.query(DeletePassword, [id, account_id]);
            
            return {
                success: true,
                rows: result.rowCount,
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

    static async update(pass_id, attribute, value ,account_id, db) {
        console.log('PasswordManager.update: starting...');
        let flag = false;
        let query = '';
        switch (attribute) {
            case 'name':
                flag = this.ValidatePasswordName(value);
                query = `UPDATE passwords SET name = $1 WHERE id = $2 AND account_id = $3 AND key = $4`;
                break;
            case 'description':
                flag = this.ValidateDescription(value);
                query = `UPDATE passwords SET description = $1 WHERE id = $2 AND account_id = $3`;
                break;
            case 'password':
                flag = true;
                query = `UPDATE passwords SET password = $1 WHERE id = $2 AND account_id = $3`;
                break;
            case 'updateablebyclient':
                flag = this.ValidateUpdateableByClient(value);
                query = `UPDATE passwords SET updateablebyclient = $1 WHERE id = $2 AND account_id = $3`;
                break;
            case 'visibility':
                flag = this.ValidateVisibility(value);
                query = `UPDATE passwords SET visibility = $1 WHERE id = $2 AND account_id = $3`;
                break;
            default:
                return {
                    error: 'Invalid attribute',
                    success: false
                }
        }
        if (!flag) {
            return {
                error: 'Invalid attribute',
                success: false
            }
        }
        value = this.SanitizeValue(value);

        try {
            const result = await db.query(query, [value, pass_id, account_id, key]);
            return {
                success: true,
                data: result.rows[0],
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }
}

module.exports = PasswordManager;