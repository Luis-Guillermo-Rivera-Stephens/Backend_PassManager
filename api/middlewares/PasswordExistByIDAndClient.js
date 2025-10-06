const PasswordGetter = require('../utils/PasswordGetter');
const { connectDB } = require('../data/connectDB');
const { validate } = require('uuid');

const PasswordExistByIDAndClient = async (req, res, next) => {
    console.log('PasswordExistByIDAndClient: starting...');
    const { pass_id } = req.params;
    const { id: account_id } = req.account_id_url || req.account;
    console.log('PasswordExistByIDAndClient: account_id', account_id);
    console.log('PasswordExistByIDAndClient: pass_id', pass_id);
    if (!validate(pass_id)) {
        console.log('PasswordExistByIDAndClient: invalid id');
        return res.status(400).json({ error: 'Invalid id' });
    }

    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('PasswordExistByIDAndClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const result = await PasswordGetter.PasswordExistByIDAndAccountID(pass_id, account_id, db);
    console.log('PasswordExistByIDAndClient: result', result);
    if (result.error) {
        console.log('PasswordExistByIDAndClient: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (!result.exists) {
        console.log('PasswordExistByIDAndClient: password does not exist');
        return res.status(404).json({ error: 'Password does not exist' });
    }

    console.log('PasswordExistByIDAndClient: password exists');
    req.password_metadata = result.data;
    next();
}

module.exports = PasswordExistByIDAndClient;