const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRES_IN;

class TokenClass {
    constructor(id, token_type) {
        this.id = id;
        this.token_type = token_type;
    }

    toToken() {
        return jwt.sign({ id: this.id, token_type: this.token_type }, secretKey, { expiresIn: expiresIn });
    }

    static AccessToken(id) {
        return new TokenClass(id, 'access').toToken();
    }
    static VerificationToken(id) {
        return new TokenClass(id, 'verification').toToken();
    }
    
}