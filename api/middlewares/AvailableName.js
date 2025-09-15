const NameManager = require('../utils/NameManager');
const connectDB = require('../data/connectDB');

const AvailableName = async (req, res, next) => {
    console.log('AvailableName: starting...');
    const { name } = req.body;
    let db = null;
    try {

        db = await connectDB();
        
    } catch (error) {
        console.log('AvailableName: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (!NameManager.ValidateName(name)) {
        console.log('AvailableName: invalid name');
        return res.status(400).json({ error: 'Invalid name' });
    }
    name = NameManager.SanitizeName(name);
    const result = await NameManager.isAvailableName(name, db);
    if (result.error) {
        console.log('AvailableName: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (result.exists) {
        console.log('AvailableName: name is already taken');
        return res.status(400).json({ error: 'Name is not available' });
    }

    console.log('AvailableName: name is available');
    req.body.name = name;
    next();
}

module.exports = AvailableName;