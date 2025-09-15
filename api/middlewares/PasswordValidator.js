const PasswordManager = require('../utils/PasswordManager');

const PasswordValidator = async (req, res, next) => {
    console.log('PasswordValidator: starting...');
    const { password } = req.body;
    if (!PasswordManager.ValidateStrongPassword(password)) {
        console.log('PasswordValidator: invalid password');
        return res.status(400).json({ error: 'Invalid password' });
    }
    password = PasswordManager.SanitizePassword(password);
    req.body.password = password;
    next();
}

module.exports = PasswordValidator;