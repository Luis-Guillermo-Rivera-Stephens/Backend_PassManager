const TokenClass = require('../utils/TokenClass');
const TokenManager = require('../utils/TokenManager');
const ApiKeyManager = require('../utils/ApiKeyManager');

const VerifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token || typeof token !== 'string') {
        return res.status(401).json({ error: 'Token is required' });
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
        console.error('❌ VerifyToken: Token verification failed:', result.error);
        return res.status(401).json({ error: result.error });
    }
    
    let token_ = TokenClass.FromDecodedInfo(result.decoded);
    
    if (!token_) {
        console.error('❌ VerifyToken: Invalid token structure');
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.token_id = token_.id;
    req.token_type = token_.token_type;
    next();
}

module.exports = VerifyToken;