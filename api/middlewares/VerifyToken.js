const TokenClass = require('../utils/TokenClass');
const TokenManager = require('../utils/TokenManager');

const VerifyToken = async (req, res, next) => {
    const api_key = process.env.APIKEY_ADMIN;

    
    console.log('🔍 VerifyToken: starting...');
    console.log('🔍 VerifyToken: api key:', api_key);
    
    const token = req.headers['authorization'];
    console.log('🔍 VerifyToken: raw token from headers:', token);
    
    if (!token || typeof token !== 'string') {
        console.log('❌ VerifyToken: token is required or invalid type');
        return res.status(401).json({ error: 'Token is required' });
    }

    if (token === api_key) {
        console.log('🔍 VerifyToken: api key verified');
        req.token_id = process.env.APIKEY_ID;
        req.token_type = "access";
        next();
        return;
    }
    
    console.log('🔍 VerifyToken: calling TokenManager.VerifyToken...');
    const result = TokenManager.VerifyToken(token);
    console.log('🔍 VerifyToken: result from TokenManager:', JSON.stringify(result, null, 2));
    
    if (result.error) {
        console.log('❌ VerifyToken: error verifying token:', result.error);
        return res.status(401).json({ error: result.error });
    }
    
    console.log('🔍 VerifyToken: decoded payload:', JSON.stringify(result.decoded, null, 2));
    console.log('🔍 VerifyToken: decoded type:', typeof result.decoded);
    console.log('🔍 VerifyToken: decoded is null?', result.decoded === null);
    console.log('🔍 VerifyToken: decoded is undefined?', result.decoded === undefined);
    
    console.log('🔍 VerifyToken: calling TokenClass.FromDecodedInfo...');
    let token_ = TokenClass.FromDecodedInfo(result.decoded);
    console.log('🔍 VerifyToken: result from TokenClass.FromDecodedInfo:', token_);
    
    if (!token_) {
        console.log('❌ VerifyToken: invalid token structure:', result.decoded);
        console.log('❌ VerifyToken: decoded.id exists?', result.decoded ? result.decoded.id : 'decoded is null/undefined');
        console.log('❌ VerifyToken: decoded.token_type exists?', result.decoded ? result.decoded.token_type : 'decoded is null/undefined');
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    console.log('✅ VerifyToken: token successfully parsed:', {
        id: token_.id,
        token_type: token_.token_type
    });

    req.token_id = token_.id;
    req.token_type = token_.token_type;
    console.log('✅ VerifyToken: token verified and attached to request');
    next();
}

module.exports = VerifyToken;