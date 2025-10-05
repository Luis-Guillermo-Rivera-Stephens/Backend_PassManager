const PasswordManager = require('../utils/PasswordManager');
const { connectDB } = require('../data/connectDB');

const UpdateAsAClient = async (req, res) => {
    console.log('UpdateAsAClient: starting...');
    const { pass_id } = req.params;
    const { attribute } = req.query;
    let { value } = req.body;
    const { id: account_id } = req.account;

    if (!['name', 'description', 'password'].includes(attribute) || !attribute) {
        console.log('UpdateAsAClient: invalid attribute');
        return res.status(400).json({ error: 'Invalid attribute' });
    }

    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('UpdateAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const result = await PasswordManager.update(pass_id, attribute, value, account_id, db);
    if (result.error) {
        console.log('UpdateAsAClient: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    console.log('UpdateAsAClient: password updated successfully');
    return res.status(200).json({ message: 'Password updated successfully' });

}

module.exports = UpdateAsAClient;