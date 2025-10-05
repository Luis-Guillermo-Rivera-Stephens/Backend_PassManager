const PasswordManager = require('../utils/PasswordManager');
const { connectDB } = require('../data/connectDB');

const DeletePasswordAsAClient = async (req, res) => {
    console.log('DeletePasswordAsAClient: starting...');
    const { pass_id } = req.params;
    const { id: account_id } = req.account;
    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('DeletePasswordAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    const result = await PasswordManager.deletePassword(pass_id, account_id, db);
    console.log('DeletePasswordAsAClient: result', result);
    if (result.error) {
        console.log('DeletePasswordAsAClient: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ message: 'Password deleted' });
}; 

module.exports = DeletePasswordAsAClient;
