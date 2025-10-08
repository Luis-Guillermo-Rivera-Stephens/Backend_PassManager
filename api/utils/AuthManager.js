const CryptoJS = require('crypto-js');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { DateTime } = require('luxon');
const TwoFASetup = require('../queries/2FASetup');
const SecretGetter = require('../queries/SecretGetter');

const ISSUER = process.env.TOTP_ISSUER || 'ReservAI PassManager'; // nombre que verán los usuarios en el autenticador

// Configuración específica para TOTP (usar UTC estándar)
authenticator.options = {
    window: 2, // tolerancia de ±2 ventanas (60 segundos)
    step: 30,  // intervalo de 30 segundos
    digits: 6, // 6 dígitos
    algorithm: 'sha1' // algoritmo de hash
};

// Configurar zona horaria para México en el autenticador
// No modificar Date.now globalmente, usar tiempo UTC estándar

class AuthManager {
    // ========= AES para manejar secretos =========
    static EncryptSecret(secret, key) {
        return CryptoJS.AES.encrypt(secret, key).toString();
    }

    static DecryptSecret(secretEnc, key) {
        return CryptoJS.AES.decrypt(secretEnc, key).toString(CryptoJS.enc.Utf8);
    }

    static GenerateSecret() {
        return authenticator.generateSecret();
    }

    static ValidateCodeFormat(code) {
        const codeRegex = /^\d{6}$/; // 6 dígitos
        return codeRegex.test(code);
    }


    // ========= Generar QR + secreto =========
    static async GenerateQRCode(email, secret) {
        if (!email || !secret) {
            throw new Error('Email es requerido');
        }

        // Construye URI estándar (Google/Microsoft Authenticator)
        const otpauth = authenticator.keyuri(email, ISSUER, secret);

        // Genera QR base64 con configuración de seguridad
        const qrDataURL = await QRCode.toDataURL(otpauth, {
            errorCorrectionLevel: 'M', // Nivel de corrección de errores medio
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',  // QR negro
                light: '#FFFFFF'  // Fondo blanco
            }
        });

        return {
            qrDataURL,   // para frontend (<img src="..." />)
            otpauth,     // URI estándar (opcional mostrar en texto)
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // Expira en 10 minutos
        };
    }

    // ========= Verificar código =========
    static VerifyCode(secret, code) {
        if (!secret || !code) {
            return { 
                success: false, 
                error: 'Secreto o código no proporcionado',
                codeStatus: null // Error técnico
            };
        }

        try {
            const isValid = authenticator.check(code, secret);
            return { 
                success: isValid, 
                error: isValid ? null : 'Código 2FA inválido',
                codeStatus: isValid ? 'valid' : 'invalid'
            };
        } catch (err) {
            return { 
                success: false, 
                error: err.message,
                codeStatus: null
            };
        }
    }

    static async TwoFASetup(account_id, secret, db) {
        try {
            await db.query(TwoFASetup, [account_id, secret]);
            return { success: true, message: 'TwoFA setup successful' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static async SecretGetter(account_id, db, key) {
        try {
            const result = await db.query(SecretGetter, [account_id]);
            let secret = result.rows[0].secret;
            if (!secret) {
                return { success: false, error: 'Secret not found' };
            }
            secret = this.DecryptSecret(secret, key);
            return { success: true, secret: secret };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = AuthManager;
