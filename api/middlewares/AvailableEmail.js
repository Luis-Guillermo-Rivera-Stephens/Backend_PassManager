const AccountManager = require('../utils/AccountManager');
const { connectDB } = require('../data/connectDB');
const EmailManager = require('../utils/EmailManager');

const AvailableEmail = async (req, res, next) => {
    console.log('AvailableEmail: starting...');
    let { email } = req.body;
    if (!EmailManager.ValidateEmail(email)) {
        console.log('AvailableEmail: invalid email');
        return res.status(400).json({ error: 'Invalid email' });
    }
    email = EmailManager.SanitizeEmail(email);

    let db = null;
    try {
        db = await connectDB();
    } catch (error) {
        console.log('AvailableEmail: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const result = await AccountManager.accountExistsByEmail(email, db);

    if (result.error) {
        console.log('AvailableEmail: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (result.exists) {
        console.log('AvailableEmail: account already exists');
        return res.status(400).json({ error: 'Account already exists' });
    }
    console.log('AvailableEmail: account is available');
    req.body.email = email;
    next();
}

module.exports = AvailableEmail;