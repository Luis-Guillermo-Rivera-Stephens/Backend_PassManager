const AccountManager = require('../utils/AccountManager');
const { connectDB } = require('../data/connectDB');
const PaginationManager = require('../utils/PaginationManager');

const SearchAccounts = async (req, res) => {
    console.log('SearchAccount: starting...');
    let { search, page } = req.query;
    page = page ? parseInt(page) : 1;
    search = search ? search : '';
    search = search.trim();
    const limit = 10;

    let db = null;
    try {
        db = await connectDB();
    } catch (error) {
        console.log('SearchAccount: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    const { offset } = PaginationManager.GetPagination(page, limit);
    const result = await AccountManager.searchAccounts(search, offset, limit, db);
    if (result.error) {
        console.log('SearchAccount: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (result.count === 0) {
        console.log('SearchAccount: no accounts found');
        return res.status(404).json({ error: 'No accounts found' });
    }
    return res.status(200).json({ data: result.accounts, total: result.count, message: 'Accounts fetched successfully', next_page: result.count > (page * limit) ? page + 1 : null, current_page: page });
}

module.exports = SearchAccounts;