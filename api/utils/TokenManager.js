const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

class TokenManager {
    static VerifyToken(token) {
        console.log('🔍 TokenManager: starting token verification...');
        console.log('🔍 TokenManager: token received:', token);
        console.log('🔍 TokenManager: secretKey exists?', !!secretKey);
        console.log('🔍 TokenManager: secretKey length:', secretKey ? secretKey.length : 'null/undefined');
        
        try {
            console.log('🔍 TokenManager: calling jwt.verify...');
            const decoded = jwt.verify(token, secretKey);
            console.log('🔍 TokenManager: jwt.verify successful');
            console.log('🔍 TokenManager: decoded result:', JSON.stringify(decoded, null, 2));
            
            return {
                success: true,
                decoded: decoded
            };
        } catch (err) {
            console.log('❌ TokenManager: jwt.verify failed');
            console.log('❌ TokenManager: error type:', err.name);
            console.log('❌ TokenManager: error message:', err.message);
            console.log('❌ TokenManager: full error:', err);
            
            return {
                success: false,
                error: `Token is invalid: ${err.message}`
            };
        }
    }
}

module.exports = TokenManager;