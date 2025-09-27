const PasswordManager = require('../utils/PasswordManager');
const TokenClass = require('../utils/TokenClass');

const Login = async (req, res) => {
    const account = req.account;
    const { password } = req.body;
    const result =  await PasswordManager.ComparePassword(password, account.password);
    if (!result) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    let token = null, verified = false, token_type = null;
    if (!account.verified) {
        token = TokenClass.EmailSenderToken(account.id);
        token_type = 'email_sender';
        verified = false;
    } else {
        token = TokenClass.AccessToken(account.id);
        token_type = 'access';
        verified = true;
    }

    return res.status(200).json({ token_type: token_type, token: token, verified: verified, message: 'Login successful', account_type: account.type, twofaenabled: account.twofaenabled });
}

module.exports = Login;