const VerifyUpdatePrivileges = async (req, res, next) => {
    console.log('VerifyUpdatePrivileges: starting...');
    const { password_metadata } = req;
    if (password_metadata.updateableByClient !== true) {
        console.log('VerifyUpdatePrivileges: password is not updateable by client');
        return res.status(403).json({ error: 'Password is not updateable by client' });
    }
    next();
}

module.exports = VerifyUpdatePrivileges;