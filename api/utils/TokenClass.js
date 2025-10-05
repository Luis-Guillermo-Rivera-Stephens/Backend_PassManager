const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRES_IN;
const apiKeyExpiresIn = process.env.JWT_API_KEY_EXPIRES_IN || '365d';

class TokenClass {
    constructor(id, token_type) {
        this.id = id;
        this.token_type = token_type;
    }

    static FromDecodedInfo(decoded) {
        console.log('🔍 TokenClass: FromDecodedInfo called');
        console.log('🔍 TokenClass: decoded parameter:', JSON.stringify(decoded, null, 2));
        console.log('🔍 TokenClass: decoded type:', typeof decoded);
        console.log('🔍 TokenClass: decoded is null?', decoded === null);
        console.log('🔍 TokenClass: decoded is undefined?', decoded === undefined);
        
        if (!decoded) {
            console.log('❌ TokenClass: decoded is null or undefined');
            return null;
        }
        
        console.log('🔍 TokenClass: decoded.id:', decoded.id);
        console.log('🔍 TokenClass: decoded.token_type:', decoded.token_type);
        console.log('🔍 TokenClass: decoded.id type:', typeof decoded.id);
        console.log('🔍 TokenClass: decoded.token_type type:', typeof decoded.token_type);
        
        if (!decoded.id || !decoded.token_type) {
            console.log('❌ TokenClass: missing required fields (id or token_type)');
            return null;
        }
        
        console.log('✅ TokenClass: creating new TokenClass instance');
        const tokenInstance = new TokenClass(decoded.id, decoded.token_type);
        console.log('✅ TokenClass: created instance:', tokenInstance);
        return tokenInstance;
    }

    toToken() {
        return jwt.sign({ id: this.id, token_type: this.token_type }, secretKey, { expiresIn: expiresIn });
    }

    toApiKey() {
        return jwt.sign({ id: this.id, token_type: this.token_type }, secretKey, { expiresIn: expiresIn });
    }

    static AccessToken(id) {
        return new TokenClass(id, 'access').toToken();
    }
    static VerificationToken(id) {
        return new TokenClass(id, 'verification').toToken();
    }

    static TwoFactorAuthorizationToken(id) {
        return new TokenClass(id, 'two_factor_authentication').toToken();
    }
    
    static EmailSenderToken(id) {
        return new TokenClass(id, 'email_sender').toToken();
    }

    static ApiKey(id) {
        return new TokenClass(id, 'access').toApiKey();
    }

}

module.exports = TokenClass;