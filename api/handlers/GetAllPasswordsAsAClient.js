const PasswordGetter = require('../utils/PasswordGetter');
const PaginationManager = require('../utils/PaginationManager');
const { connectDB } = require('../data/connectDB');

const GetAllPasswordsAsAClient = async (req, res) => {
    console.log('GetAllPasswordsAsAClient: starting...');
    const { id } = req.account;
    let { page, search } = req.query;
    page = page ? parseInt(page) : 1;
    const limit = 5;

    search = search ? search : '';
    search = search.trim();

    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('GetAllPasswordsAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const { offset } = PaginationManager.GetPagination(page, limit);
    const result = await PasswordGetter.GetAllPasswords(id, false, offset, limit + 1, db, search);
    if (result.error) {
        console.log('GetAllPasswordsAsAClient: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (!result.total === 0) {
        console.log('GetAllPasswordsAsAClient: no passwords found');
        return res.status(404).json({ error: 'No passwords found' });
    }

    let total = result.total > limit ? limit : result.total;
    let next_page = result.total > limit ? page + 1 : null;
    if (result.total > limit) {
        result.data = result.data.slice(0, limit);
    }
    return res.status(200).json({ data: result.data, total: total, message: 'Passwords fetched successfully', next_page: next_page, current_page: page });
}

module.exports = GetAllPasswordsAsAClient;