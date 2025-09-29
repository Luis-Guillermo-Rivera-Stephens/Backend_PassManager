const AccountManager = require('../utils/AccountManager');
const { connectDB } = require('../data/connectDB');


const DeleteAccount = async (req, res) => {
    console.log('DeleteAccount: starting...');

    const id = req.account_id;
    const db = await connectDB();
    
    const result = await AccountManager.deleteAccount(id, db);
    if (result.error) {
        console.log('DeleteAccount: error', result.error);
        return res.status(500).json({ error: result.error });
    }
  
    return res.status(200).json({ message: 'Account deleted' , success: true, id: id });
}

module.exports = DeleteAccount;