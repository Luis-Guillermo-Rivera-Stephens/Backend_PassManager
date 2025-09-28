const TwoFATokenType = async (req, res, next) => {
    console.log('TwoFATokenType: starting...');
    const token_type = req.token_type;
    if (token_type !== 'two_factor_authentication') {
        console.log('TwoFATokenType: invalid token type');
        return res.status(401).json({ error: 'Invalid token type' });
    }
    next();
}

module.exports = TwoFATokenType;