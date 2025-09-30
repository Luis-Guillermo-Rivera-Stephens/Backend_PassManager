const PasswordManager = require('../utils/PasswordManager');
const { connectDB } = require('../data/connectDB');
const { Password } = require('../models/password');

const CreatePasswordInAnotherAccount = async (req, res) => {
    console.log('CreatePasswordInAnotherAccount: starting...');
    const {account_id} = req.params;
    const account_type_url = req.account_type_url;
    if (account_type_url === 'admin') {
        console.log('CreatePasswordInAnotherAccount: account is an admin');
        return res.status(403).json({ error: 'Account is an admin, you cannot create a password in another admin account' });
    }
    let { name, description, password, updateablebyclient, visibility } = req.body;
    description = description || '';
    updateablebyclient = updateablebyclient || true;
    visibility = visibility || true;
    
    console.log('CreatePasswordInAnotherAccount: name, password, account_id', name, password, account_id);
    if (!name || !password || !account_id) {
        console.log('CreatePasswordInAnotherAccount: invalid name, password or account_id');
        return res.status(400).json({ error: 'Invalid name, password or account_id' });
    }

    let db = null;
    try {
        db = await connectDB();
    } catch (error) {
        console.log('CreatePasswordInAnotherAccount: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (!PasswordManager.ValidatePasswordValue(password)) {
        console.log('CreatePasswordInAnotherAccount: invalid password');
        return res.status(400).json({ error: 'Invalid password' });
    }
    password = PasswordManager.SanitizePassword(password);
    password = PasswordManager.HidePassword(password);

    const instance = Password.newPasswordAsAnAdmin(name, description, password, updateablebyclient, visibility, account_id);

    const result = await PasswordManager.createPassword(instance, db);
    if (result.error) {
        console.log('CreatePasswordInAnotherAccount: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    console.log('CreatePasswordInAnotherAccount: password created successfully');
    return res.status(200).json({ message: 'Password created successfully' });
    
}

module.exports = CreatePasswordInAnotherAccount;