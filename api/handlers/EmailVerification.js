const AccountManager = require('../utils/AccountManager');
const { connectDB } = require('../data/connectDB');
const TokenClass = require('../utils/TokenClass');

const EmailVerification = async (req, res) => {
    console.log('EmailVerification: starting...');
    const id = req.token_id;
    let db = null;
    try {
        db = await connectDB();
        
    } catch (error) {
        console.log('EmailVerification: error', error);
        return res.status(500).json({ error: error.message });
    }

    try {
        await AccountManager.verifyAccount(id, db);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Account verified', token_type: 'two_factor_authentication', token: TokenClass.TwoFactorAuthorizationToken(id) });

}

module.exports = EmailVerification;