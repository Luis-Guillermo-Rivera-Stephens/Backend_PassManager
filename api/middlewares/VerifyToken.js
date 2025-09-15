const TokenClass = require('../utils/TokenClass');
const TokenManager = require('../utils/TokenManager');

const VerifyToken = async (req, res, next) => {
    console.log('VerifyToken: starting...');
    const token = req.headers['authorization'];
    if (!token || typeof token !== 'string') {
        console.log('VerifyToken: token is required');
        return res.status(401).json({ error: 'Token is required' });
    }
    const result = TokenManager.VerifyToken(token);
    if (result.error) {
        console.log('VerifyToken: error verifying token: ', result.error);
        return res.status(401).json({ error: result.error });
    }
    let token_ = TokenClass.FromDecodedInfo(result.decoded);
    if (!token_) {
        console.log('VerifyToken: invalid token: ', result.decoded);
        return res.status(401).json({ error: 'Invalid token' });
    }
    console.log('VerifyToken: decoded info: ', token_);

    req.token_id = token_.id;
    req.token_type = token_.token_type;
    console.log('VerifyToken: token verified');
    next();
}

module.exports = VerifyToken;