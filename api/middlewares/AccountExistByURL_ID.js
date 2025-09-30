const AccountManager = require('../utils/AccountManager');
const { connectDB } = require('../data/connectDB');
const {validate} = require('uuid');

const AccountExistByURLID = async (req, res, next) => {
    console.log('AccountExistByURLID: starting...');
    const id = req.params.account_id;
    if (!validate(id)) {
        console.log('AccountExistByURLID: invalid id');
        return res.status(400).json({ error: 'Invalid id' });
    }

    const db = await connectDB();
    const result = await AccountManager.accountExistsByID(id, db);
    if (result.error) {
        console.log('AccountExistByURLID: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (!result.exists) {
        console.log('AccountExistByURLID: account does not exist');
        return res.status(400).json({ error: 'Account does not exist' });
    }

    console.log('AccountExistByURLID: account exists');
    req.account_id = id;
    req.account_type = result.account.type;
    console.log('AccountExistByURLID: account exists');
    next();
}

module.exports = AccountExistByURLID;