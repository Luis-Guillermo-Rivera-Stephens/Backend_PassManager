const AccountManager = require('../utils/AccountManager');
const { connectDB } = require('../data/connectDB');
const PasswordGetter = require('../utils/PasswordGetter');
const PaginationManager = require('../utils/PaginationManager');
const { PasswordSummary } = require('../models/password');

const SearchAccountInfoByID = async (req, res) => {
    console.log('SearchAccountInfoByID: starting...');
    const { account_id } = req.params;
    let {page, search} = req.query;
    page = page ? parseInt(page) : 1;
    search = search ? search : '';
    search = search.trim();
    const limit = 5;

    let db = null;

    try {
        db = await connectDB();
    } catch (error) {
        console.log('SearchAccountInfoByID: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    const { offset } = PaginationManager.GetPagination(page, limit);

    const result_account = await AccountManager.accountExistsByID(account_id, db);
    if (result_account.error) {
        console.log('SearchAccountInfoByID: error', result_account.error);
        return res.status(500).json({ error: result_account.error });
    }
    if (!result_account.exists) {
        console.log('SearchAccountInfoByID: account does not exist');
        return res.status(404).json({ error: 'Account does not exist' });
    }

    const credentials = req.account.type === 'admin';
    const result_passwords = await PasswordGetter.GetAllPasswords(account_id, credentials, offset, limit + 1, db, search);
    if (result_passwords.error) {
        console.log('SearchAccountInfoByID: error', result_passwords.error);
        return res.status(500).json({ error: result_passwords.error });
    }

    let account = result_account.account;
    account.password = undefined;
    account.created_at = undefined;
    account.twofaenabled = undefined;
    account.verified = undefined;
    account.started = undefined;


    let passwords = result_passwords.data;
    let total = result_passwords.total > limit ? limit : result_passwords.total;
    let next_page = result_passwords.total > limit ? page + 1 : null;
    if (result_passwords.total > limit) {
        passwords = passwords.slice(0, limit);
    }

    return res.status(200).json({ data: {account: account, passwords: passwords}, total: total, message: 'Account info fetched successfully', next_page: next_page, current_page: page });
}

module.exports = SearchAccountInfoByID;