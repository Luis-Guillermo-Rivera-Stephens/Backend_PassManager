const AdminValidator = async (req, res, next) => {
    console.log('AdminValidator: starting...');
    const account = req.account;
    if (account.type !== 'admin') {
        console.log('AdminValidator: account is not an admin');
        return res.status(403).json({ error: 'Account is not an admin' });
    }
    console.log('AdminValidator: account is an admin');
    next();
}

module.exports = AdminValidator;