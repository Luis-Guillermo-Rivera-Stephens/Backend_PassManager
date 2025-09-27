const express = require('express');
const router = express.Router();

//middlewares
const AccessTokenType = require('../middlewares/AccessTokenType');
const AccountExistByEmail = require('../middlewares/AccountExistByEmail');
const AccountExistByID = require('../middlewares/AccountExistByID')
const AccountExistByURLID = require('../middlewares/AccountExistByURL_ID');
const AdminValidator = require('../middlewares/AdminValidator');
const AvailableEmail = require('../middlewares/AvailableEmail');
const AvailableName = require('../middlewares/AvailableName');
const PasswordValidator = require('../middlewares/PasswordValidator');
const VerificationTokenType = require('../middlewares/VerificationTokenType');
const VerifyToken = require('../middlewares/VerifyToken');
const VerifyURLToken = require('../middlewares/VerifyURLToken');
const AccountIsVerified = require('../middlewares/AccountIsVerified');
const VerifyUpdatePrivileges = require('../middlewares/VerifyUpdatePrivileges');
const PasswordExistByIDAndClient = require('../middlewares/PasswordExistByIDAndClient');
const PasswordNameValidator = require('../middlewares/PasswordNameValidator');
const EmailSenderTokenType = require('../middlewares/EmailSenderTokenType');


//handlers
const CreateAccount = require('../handlers/CreateAccount');
const EmailVerification = require('../handlers/EmailVerification');
const Login = require('../handlers/Login');
const DeleteAccount = require('../handlers/DeleteAccount');
const GetAllPasswordsAsAClient = require('../handlers/GetAllPasswordsAsAClient');
const GetPasswordByIDAsAClient = require('../handlers/GetPasswordByIDAsAClient');
const CreatePasswordAsAClient = require('../handlers/CreatePasswordAsAClient');
const DeletePasswordAsAClient = require('../handlers/DeletePasswordAsAClient');
const UpdateAsAClient = require('../handlers/UpdateAsAClient');
const ResendEmail = require('../handlers/ResendEmail');



router.get('/health', (req, res) => {
    console.log('Health check: OK, time: ', new Date().toISOString());
    return res.json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

router.post('/account', AccountExistByEmail, Login);
router.put('/account', VerifyToken, AccountExistByID, AccessTokenType, AdminValidator, AvailableName, AvailableEmail, PasswordValidator, CreateAccount);
router.delete('/account/:id', VerifyToken, AccountExistByID, AccessTokenType, AdminValidator, AccountExistByURLID, DeleteAccount);

router.get('/verfication', VerifyToken, AccountExistByID, EmailSenderTokenType, ResendEmail);
router.get('/verification/:token', VerifyURLToken, AccountExistByID,VerificationTokenType, EmailVerification);

router.get('/p',VerifyToken, AccountExistByID , AccessTokenType,AccountIsVerified, GetAllPasswordsAsAClient);
router.get('/p/:id', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordExistByIDAndClient, GetPasswordByIDAsAClient);
router.post('/p', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordNameValidator, CreatePasswordAsAClient);
router.put('/p/:attribute/:id', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordExistByIDAndClient, VerifyUpdatePrivileges, PasswordNameValidator, UpdateAsAClient);

router.delete('/p/:id', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordExistByIDAndClient, VerifyUpdatePrivileges, DeletePasswordAsAClient);

  // Middleware para manejar rutas no encontradas
router.use((req, res) => {
    return res.status(404).json({
      error: 'Ruta no encontrada',
      path: req.originalUrl,
      method: req.method
    });
  });

module.exports = router;