const EmailManager = require('../utils/EmailManager');
const TokenClass = require('../utils/TokenClass');

const ResendEmail = async (req, res) => {
    console.log('ResendEmail: starting...');
    const token = TokenClass.VerificationToken(req.account.id);
    const result = await EmailManager.sendVerificationEmail(req.account.email, token);
    if (result.error) {
        return res.status(500).json({ error: result.error });   
    }
    return res.status(200).json({ message: 'Email sent successfully' });
}

module.exports = ResendEmail;