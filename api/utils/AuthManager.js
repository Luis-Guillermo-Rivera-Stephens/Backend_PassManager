const CryptoJS = require('crypto-js');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

const AES_KEY = process.env.AES_KEY;
const ISSUER = process.env.TOTP_ISSUER || 'MyApp'; // nombre que verán los usuarios en el autenticador

class AuthManager {
    // ========= AES para manejar secretos =========
    static EncryptSecret(secret) {
        return CryptoJS.AES.encrypt(secret, AES_KEY).toString();
    }

    static DecryptSecret(secretEnc) {
        return CryptoJS.AES.decrypt(secretEnc, AES_KEY).toString(CryptoJS.enc.Utf8);
    }

    // ========= Generar QR + secreto =========
    static async GenerateQRCode(email) {
        if (!email) {
            throw new Error('Email es requerido');
        }

        // Genera secreto base32
        const secret = authenticator.generateSecret();

        // Construye URI estándar (Google/Microsoft Authenticator)
        const otpauth = authenticator.keyuri(email, ISSUER, secret);

        // Genera QR base64
        const qrDataURL = await QRCode.toDataURL(otpauth);

        // Devuelve el secreto cifrado (guardar en DB)
        const secretEnc = this.EncryptSecret(secret);

        return {
            qrDataURL,   // para frontend (<img src="..." />)
            otpauth,     // URI estándar (opcional mostrar en texto)
            secretEnc    // guardar en base de datos
        };
    }

    // ========= Verificar código =========
    static VerifyCode(secretEnc, code) {
        if (!secretEnc || !code) {
            return { success: false, error: 'Secreto o código no proporcionado' };
        }

        try {
            const secret = this.DecryptSecret(secretEnc);
            const isValid = authenticator.check(code, secret);
            return { success: isValid };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = AuthManager;
