const EmailSenderTokenType = async (req, res, next) => {
    console.log('EmailSenderTokenType: starting...');
    const token_type = req.token_type;
    if (token_type !== 'email_sender') {
        console.log('EmailSenderTokenType: invalid token type');
        return res.status(401).json({ error: 'Invalid token type' });
    }
    next();
}

module.exports = EmailSenderTokenType;