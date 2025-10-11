const TokenClass = require('../utils/TokenClass');
const TokenManager = require('../utils/TokenManager');
const ApiKeyManager = require('../utils/ApiKeyManager');

const VerifyURLToken = async (req, res, next) => {
    console.log('VerifyURLToken: starting...');
    const token = req.params.token;
    if (!token || typeof token !== 'string') {
        console.log('VerifyURLToken: token is required');
        return res.status(418).json({ error: 'Token is required' });
    }

    let token_id = ApiKeyManager.VerifyApiKey(token);
    if (token_id) {
        req.token_id = token_id;
        req.token_type = "access";
        next();
        return;
    }

    const result = TokenManager.VerifyToken(token);
    if (result.error) {
        console.log('VerifyURLToken: error verifying token: ', result.error);
        return res.status(418).json({ error: result.error });
    }
    let token_ = TokenClass.FromDecodedInfo(result.decoded);
    if (!token_) {
        console.log('VerifyURLToken: invalid token: ', result.decoded);
        return res.status(418).json({ error: 'Invalid token' });
    }
    // Token structure validated successfully

    req.token_id = token_.id;
    req.token_type = token_.token_type;
    console.log('VerifyURLToken: token verified');
    next();
}

module.exports = VerifyURLToken;