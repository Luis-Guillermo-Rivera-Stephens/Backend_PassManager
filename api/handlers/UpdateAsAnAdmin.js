const PasswordManager = require('../utils/PasswordManager');
const { connectDB } = require('../data/connectDB');

const UpdateAsAnAdmin = async (req, res) => {
    console.log('UpdateAsAnAdmin: starting...');
    const { pass_id } = req.params;
    const { attribute } = req.query;
    let { value } = req.body;
    const account_id_url = req.account_id_url.id;

    if (!['name', 'description', 'password', 'updateablebyclient', 'visibility'].includes(attribute) || !attribute) {
        console.log('UpdateAsAnAdmin: invalid attribute');
        return res.status(400).json({ error: 'Invalid attribute' });
    }

    let db = null;
    try {
        db = await connectDB();
    }   catch (error) {
        console.log('UpdateAsAnAdmin: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const result = await PasswordManager.update(pass_id, attribute, value, account_id_url, db);
    if (result.error) {
        console.log('UpdateAsAnAdmin: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ message: 'Password updated successfully' });

}

module.exports = UpdateAsAnAdmin;