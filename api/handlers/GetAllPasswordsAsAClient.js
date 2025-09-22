const PasswordGetter = require('../utils/PasswordGetter');
const PaginationManager = require('../utils/PaginationManager');
const { connectDB } = require('../data/connectDB');

const GetAllPasswordsAsAClient = async (req, res) => {
    console.log('GetAllPasswordsAsAClient: starting...');
    const { id } = req.account;
    let { page } = req.query;
    page = page ? parseInt(page) : 1;
    const limit = 10;


    let db = null;
    try {
        db = await connectDB();
    }
    catch (error) {
        console.log('GetAllPasswordsAsAClient: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const { offset } = PaginationManager.GetPagination(page, limit);
    const result = await PasswordGetter.GetAllPasswords_CLIENT(id, offset, limit, db);
    if (result.error) {
        console.log('GetAllPasswordsAsAClient: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (!result.total === 0) {
        console.log('GetAllPasswordsAsAClient: no passwords found');
        return res.status(404).json({ error: 'No passwords found' });
    }
    return res.status(200).json({ data: result.data, total: result.total, message: 'Passwords fetched successfully', next_page: result.total > (page * limit) ? page + 1 : null, current_page: page });
}

module.exports = GetAllPasswordsAsAClient;