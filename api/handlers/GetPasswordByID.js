const PasswordGetter = require('../utils/PasswordGetter');
const { connectDB } = require('../data/connectDB');
const PasswordManager = require('../utils/PasswordManager');
const KeyManager = require('../utils/KeyManager');

const GetPasswordByID = async (req, res) => {
    console.log('GetPasswordById: starting...');
    const { pass_id } = req.params;
    let account_id = null;
    let email = null;
    let salt = null;
    let credentials = false;

    if (req.originalUrl.includes('/a/')) {
        account_id = req.account_id_url.id;
        let result_key_info = await KeyManager.GetKeyInfoByID(account_id, db);
        if (result_key_info.error) {
            console.log('GetPasswordById: error', result_key_info.error);
            return res.status(500).json({ error: result_key_info.error });
        }
        email = result_key_info.email;
        salt = result_key_info.salt;
        credentials = true;

    } else {
        account_id = req.account.id;
        email = req.account.email;
        salt = req.account.salt;
        credentials = false;
    }

    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('GetPasswordById: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    var result = await PasswordGetter.GetPasswordById(pass_id, account_id, db, credentials );
    if (result.error) {
        console.log('GetPasswordById: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (!result.total === 0) {
            console.log('GetPasswordById: no password found');
        return res.status(404).json({ error: 'No password found' });
    }

    try {
        let key = KeyManager.GetKey(email, salt);
        let password = PasswordManager.ShowPassword(result.data.password, key);
        result.data.password = password;
    } catch (error) {
        console.log('GetPasswordById: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }


    return res.status(200).json({ data: result.data, total: result.total, message: 'Password fetched successfully' });
}

module.exports = GetPasswordByID    ;