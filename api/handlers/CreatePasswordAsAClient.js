const PasswordManager = require('../utils/PasswordManager');
const { connectDB } = require('../data/connectDB');
const {Password} = require('../models/password');
const KeyManager = require('../utils/KeyManager');

const CreatePasswordAsAClient = async (req, res) => {
    console.log('CreatePasswordAsAClient: starting...');
    let { name, password, description } = req.body;
    description = description || '';

    const { id, salt, email } = req.account;
    let db = null;
    console.log('CreatePasswordAsAClient: id', id);
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('CreatePasswordAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    if (!PasswordManager.ValidatePasswordValue(password)) {
        console.log('CreatePasswordAsAClient: invalid password');
        return res.status(400).json({ error: 'Invalid password' });
    }
    password = PasswordManager.SanitizePassword(password);

    let key = null;
    try {
        key = await KeyManager.GetKey(email, salt);
    } catch (error) {
        console.log('CreatePasswordAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    password = PasswordManager.HidePassword(password, key);

    const instance = Password.newPasswordAsAClient(name, description, password, id);

    const result = await PasswordManager.createPassword(instance, db);
    if (result.error) {
        console.log('CreatePasswordAsAClient: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    console.log('CreatePasswordAsAClient: password created successfully');
    return res.status(200).json({ message: 'Password created successfully' });

}

module.exports = CreatePasswordAsAClient;