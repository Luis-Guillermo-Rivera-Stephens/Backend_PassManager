const AuthManager = require('../utils/AuthManager');
const { connectDB } = require('../data/connectDB');

const TwoFASetup = async (req, res) => {
    const { id: account_id, twofaenabled } = req.account;

    if (twofaenabled) {
        return res.status(400).json({ error: 'TwoFA already enabled' });
    }

    let db = null;
    try {
        db = await connectDB();
    } catch (error) {
        console.log('TwoFASetup: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const secret = AuthManager.GenerateSecret();
    let qrCode = null;
    let encryptedSecret = null;
    
    try {

        encryptedSecret = AuthManager.EncryptSecret(secret);
        qrCode = await AuthManager.GenerateQRCode(req.account.email, secret);
        const result = await AuthManager.TwoFASetup(account_id, encryptedSecret, db);
        if (result.error) {
            console.log('TwoFASetup: error', result.error);
            return res.status(500).json({ error: result.error });
        }

    } catch (error) {
        console.log('TwoFASetup: error', error);

        return res.status(500).json({ error: 'Internal server error' });
    }
    
    return res.status(200).json({ qrCode: qrCode.qrDataURL, message: 'TwoFA setup successful' });
}

module.exports = TwoFASetup;