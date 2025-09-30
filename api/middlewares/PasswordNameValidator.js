//TODO

const PasswordManager = require('../utils/PasswordManager');
const { connectDB } = require('../data/connectDB');

const PasswordNameValidator = async (req, res, next) => {
    console.log('PasswordNameValidator: starting...');
    let { name, value } = req.body;
    let {attribute} = req.params;
    const { account_id } = req.account;

    //Este middleware es para validar el nombre del password
    //Si el atributo no es name, se pasa al siguiente middleware
    //pero usamos el mismo endpoint para actualizar todos los atributos
    if (attribute && attribute !== 'name') {
        console.log('PasswordNameValidator: skipping validation for attribute:', attribute);
        next();
        return;
    }

    if (!name && value) {
        name = value;
    }

    let db = null;
    try {
        db = await connectDB();
    } catch (error) {
        console.log('PasswordNameValidator: error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (!PasswordManager.ValidatePasswordName(name)) {
        console.log('PasswordNameValidator: invalid name');
        return res.status(400).json({ error: 'Invalid name' });
    }
    name = PasswordManager.SanitizePasswordName(name);
    const result = await PasswordManager.PasswordNameIsAvailable(name, account_id, db);
    if (result.error) {
        console.log('PasswordNameValidator: error', result.error);
        return res.status(500).json({ error: result.error });
    }
    if (result.exists) {
        console.log('PasswordNameValidator: name is already taken');
        return res.status(400).json({ error: 'Name is not available' });
    }
    console.log('PasswordNameValidator: name is available');
    req.body.name = name;
    next();
}

module.exports = PasswordNameValidator;