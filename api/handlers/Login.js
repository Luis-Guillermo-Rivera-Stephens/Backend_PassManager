const PasswordManager = require('../utils/PasswordManager');
const TokenClass = require('../utils/TokenClass');

const Login = async (req, res) => {
    const account = req.account;
    const { password } = req.body;
    const result =  await PasswordManager.ComparePassword(password, account.password);
    if (!result) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    let token = null, verified = false;
    if (!account.verified) {
        token = TokenClass.VerificationToken(account.id);
        verified = false;
    } else {
        token = TokenClass.AccessToken(account.id);
        verified = true;
    }

    return res.status(200).json({ access_token: token, verified: verified, message: 'Login successful', account_type: account.type });
}

module.exports = Login;