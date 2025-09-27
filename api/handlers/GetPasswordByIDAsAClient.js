const PasswordGetter = require('../utils/PasswordGetter');
const { connectDB } = require('../data/connectDB');
const PasswordManager = require('../utils/PasswordManager');

const GetPasswordByIDAsAClient = async (req, res) => {
    console.log('GetPasswordByIDAsAClient: starting...');
    const { id } = req.params;
    const account = req.account;
    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('GetPasswordByIDAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    var result = await PasswordGetter.GetPasswordById_CLIENT(id, account.id, db);
    if (result.error) {
        console.log('GetPasswordByIDAsAClient: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (!result.total === 0) {
        console.log('GetPasswordByIDAsAClient: no password found');
        return res.status(404).json({ error: 'No password found' });
    }

    try {
        let password = PasswordManager.ShowPassword(result.data.password);
        result.data.password = password;
    } catch (error) {
        console.log('GetPasswordByIDAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }


    return res.status(200).json({ data: result.data, total: result.total, message: 'Password fetched successfully' });
}

module.exports = GetPasswordByIDAsAClient;