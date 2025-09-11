const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

class TokenManager {
    static VerifyToken(token) {
        return jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return {
                    success: false,
                    message: 'Token is invalid'
                }
            }
            return {
                success: true,
                decoded: decoded
            }
        });
    }
}

module.exports = TokenManager;