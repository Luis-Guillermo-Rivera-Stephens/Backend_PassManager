const AccountIsVerified = async (req, res, next) => {
    console.log('AccountIsVerified: starting...');
    const { account } = req;
    if (!account.verified) {
        console.log('AccountIsVerified: account is not verified');
        return res.status(403).json({ error: 'Account is not verified' });
    }
    next();
}

module.exports = AccountIsVerified;