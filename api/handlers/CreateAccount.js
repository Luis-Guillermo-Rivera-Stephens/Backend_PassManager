const AccountManager = require('../utils/AccountManager');
const { connectDB } = require('../data/connectDB');
const Account = require('../models/account');
const PasswordManager = require('../utils/PasswordManager');
const EmailManager = require('../utils/EmailManager');
const TokenClass = require('../utils/TokenClass');

const CreateAccount = async (req, res) => {
    console.log('CreateAccount: starting...');
    let { name, email, password, type} = req.body;

    type = ['client', 'admin'].includes(type) ? type : 'client';
    let db = null;
    try {
        db = await connectDB();
        password = await PasswordManager.EncryptPassword(password);
    } catch (error) {
        console.log('CreateAccount: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    
    const account = Account.newAccount(name, email, password, type || 'client');
    const verificationToken = TokenClass.VerificationToken(account.id);
    const result = await AccountManager.createAccount(account, db, EmailManager, verificationToken);
    if (result.error) {
        console.log('CreateAccount: error', result.error);
        return res.status(500).json({ error: result.error });
    }

    const emailSenderToken = TokenClass.EmailSenderToken(account.id);
    console.log('CreateAccount: emailSenderToken', emailSenderToken);
    
    console.log('CreateAccount: account created successfully');

    res.status(200).json({ token_type: 'email_sender', token: emailSenderToken, message: 'Account created successfully', account_type: account.type, verified: false, twofaenabled: account.twofaenabled });
}

module.exports = CreateAccount;