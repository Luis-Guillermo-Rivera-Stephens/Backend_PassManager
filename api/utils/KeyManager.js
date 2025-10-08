const crypto = require('crypto');
const GetSaltByID = require('../queries/GetKeyInfoByID');

const AES_KEY = process.env.AES_KEY;

class KeyManager {
    static async GetKeyInfoByID(id, db) {
        try {
            const result = await db.query(GetSaltByID, [id]);
            return {salt: result.rows[0].salt, email: result.rows[0].email, success: true};
        } catch (error) {
            console.log('KeyManager: error getting salt by id:', error);
            return {error: error.message, success: false};
        }
    }

    static GetKey(email, salt) {
        // 1️⃣ Generamos una semilla determinista a partir de la salt y las cadenas
        const str1 = AES_KEY;
        const str2 = email;
        
        const hash = crypto.createHash("sha256")
            .update(str1 + str2 + salt)
            .digest("hex");

        // 2️⃣ Unimos ambas cadenas
        const combined = str1 + str2;

        // 3️⃣ Creamos un generador pseudoaleatorio determinista a partir del hash
        let seed = parseInt(hash.slice(0, 8), 16);
        function random() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        }

        // 4️⃣ Mezclamos los caracteres en base a ese generador
        const chars = combined.split("");
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }

        // 5️⃣ Retornamos la mezcla final
        return chars.join("");
    }
}

module.exports = KeyManager;