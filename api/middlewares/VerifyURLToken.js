const TokenClass = require('../utils/TokenClass');
const TokenManager = require('../utils/TokenManager');

const VerifyURLToken = async (req, res, next) => {
    console.log('VerifyURLToken: starting...');
    const token = req.params.token;
    if (!token || typeof token !== 'string') {
        console.log('VerifyURLToken: token is required');
        return res.status(401).json({ error: 'Token is required' });
    }
    const result = TokenManager.VerifyToken(token);
    if (result.error) {
        console.log('VerifyURLToken: error verifying token: ', result.error);
        return res.status(401).json({ error: result.error });
    }
    let token_ = TokenClass.FromDecodedInfo(result.decoded);
    if (!token_) {
        console.log('VerifyURLToken: invalid token: ', result.decoded);
        return res.status(401).json({ error: 'Invalid token' });
    }
    console.log('VerifyURLToken: decoded info: ', token_);

    req.token_id = token_.id;
    req.token_type = token_.token_type;
    console.log('VerifyURLToken: token verified');
    next();
}

module.exports = VerifyURLToken;