const VerificationTokenType = async (req, res, next) => {
    console.log('VerificationTokenType: starting...');
    const token_type = req.token_type;
    if (token_type !== 'verification') {
        console.log('VerificationTokenType: invalid token type');
        return res.status(401).json({ error: 'Invalid token type' });
    }
    next();
}

module.exports = VerificationTokenType;