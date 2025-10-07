const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

class TokenManager {
    static VerifyToken(token) {
        try {
            const decoded = jwt.verify(token, secretKey);
            return {
                success: true,
                decoded: decoded
            };
        } catch (err) {
            console.error('❌ TokenManager: Token verification failed:', err.message);
            return {
                success: false,
                error: `Token is invalid: ${err.message}`
            };
        }
    }
}

module.exports = TokenManager;