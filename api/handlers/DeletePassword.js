const PasswordManager = require('../utils/PasswordManager');
const { connectDB } = require('../data/connectDB');

const DeletePassword = async (req, res) => {
    console.log('DeletePassword: starting...');
    const { pass_id } = req.params;
    const { id: account_id } =  req.account_id_url || req.account;

    if (!validate(pass_id)) {
        console.log('DeletePassword: invalid UUID');
        return res.status(400).json({ error: 'Invalid UUID' });
    }
    
    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('DeletePassword: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    const result = await PasswordManager.deletePassword(pass_id, account_id, db);
    console.log('DeletePassword: result', result);
    if (result.error) {
        console.log('DeletePassword: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ message: 'Password deleted' });
}; 

module.exports = DeletePassword;
