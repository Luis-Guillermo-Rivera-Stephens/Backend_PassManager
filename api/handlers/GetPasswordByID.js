const PasswordGetter = require('../utils/PasswordGetter');
const { connectDB } = require('../data/connectDB');
const PasswordManager = require('../utils/PasswordManager');

const GetPasswordByID = async (req, res) => {
    console.log('GetPasswordById: starting...');
    const { pass_id } = req.params;
    if (req.originalUrl.includes('/a/')) {
        account_id = req.account_id_url.id;
    } else {
        account_id = req.account.id;
    }
    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('GetPasswordById: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    var result = await PasswordGetter.GetPasswordById(pass_id, account_id, db, false);
    if (result.error) {
        console.log('GetPasswordById: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (!result.total === 0) {
            console.log('GetPasswordById: no password found');
        return res.status(404).json({ error: 'No password found' });
    }

    try {
        let password = PasswordManager.ShowPassword(result.data.password);
        result.data.password = password;
    } catch (error) {
        console.log('GetPasswordById: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }


    return res.status(200).json({ data: result.data, total: result.total, message: 'Password fetched successfully' });
}

module.exports = GetPasswordByID    ;