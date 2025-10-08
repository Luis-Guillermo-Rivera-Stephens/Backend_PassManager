const AuthManager = require('../utils/AuthManager');
const { connectDB } = require('../data/connectDB');
const TokenClass = require('../utils/TokenClass');
const AttemptsManager = require('../utils/AttemptsManager');
const KeyManager = require('../utils/KeyManager');

const Verify2FACode = async (req, res) => {
    const { code } = req.body;
    const { id: account_id, email, salt } = req.account;


    if (!AttemptsManager.validateNewAttempt(account_id)) {
        return res.status(400).json({ error: 'Too many attempts' });
    }

    if (!code || !AuthManager.ValidateCodeFormat(code)) {
        return res.status(400).json({ error: 'Invalid code' });
    }

    let db = null;
    try {
        db = await connectDB();
    } catch (error) {
        console.log('Verify2FACode: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    let key = KeyManager.GetKey(email, salt);
    const result_secret = await AuthManager.SecretGetter(account_id, db, key);
    if (!result_secret.success) {
        console.log('Verify2FACode: error', result_secret.error);
        return res.status(500).json({ error: result_secret.error });
    }
    // Secret and code validation in progress
    
    const result_verify = AuthManager.VerifyCode(result_secret.secret, code);
    console.log('Verify2FACode: result_verify', result_verify);
    
    // Manejar errores técnicos
    if (result_verify.error) {
        console.log('Verify2FACode: technical error', result_verify.error);
        return res.status(500).json({ 
            error: result_verify.error,
            codeStatus: result_verify.codeStatus 
        });
    }
    
    // Manejar código incorrecto (no es error técnico)
    if (!result_verify.success) {
        console.log('Verify2FACode: invalid code');
        AttemptsManager.incrementAttempt(account_id);
        return res.status(400).json({ 
            error: 'Invalid 2FA code',
            codeStatus: result_verify.codeStatus 
        });
    }
    // Código válido
    console.log('Verify2FACode: code verified successfully');

    AttemptsManager.resetAttempt(account_id);
    return res.status(200).json({ 
        message: '2FA code verified successfully',
        token_type: 'access', 
        token: TokenClass.AccessToken(account_id),
        codeStatus: result_verify.codeStatus
    });
}

module.exports = Verify2FACode;