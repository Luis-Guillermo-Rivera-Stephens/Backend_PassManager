const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

const AES_KEY = process.env.AES_KEY;

class PasswordManager {

    static ValidateStrongPassword(password) {
        password = this.SanitizePassword(password);
        if (!password) return false;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/;
        return regex.test(password);
    }

    static SanitizePassword(password) {
        return password.trim();
    }


    static async EncryptPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    static async ComparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static HidePassword(password) {
        return CryptoJS.AES.encrypt(password, AES_KEY).toString();
    }

    static ShowPassword(password) {
        return CryptoJS.AES.decrypt(password, AES_KEY).toString(CryptoJS.enc.Utf8);
    } 

}

module.exports = PasswordManager;