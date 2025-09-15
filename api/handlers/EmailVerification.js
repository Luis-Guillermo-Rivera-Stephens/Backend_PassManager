const EmailVerification = async (req, res) => {
    console.log('EmailVerification: starting...');
    const id = req.token_id;
    const db = await connectDB();

    try {
        await AccountManager.verifyAccount(id, db);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Account verified' });

}

module.exports = EmailVerification;