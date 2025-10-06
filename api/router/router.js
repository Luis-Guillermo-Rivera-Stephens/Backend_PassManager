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
const TwoFATokenType = require('../middlewares/2FATokenType');

//handlers
const CreateAccount = require('../handlers/CreateAccount');
const EmailVerification = require('../handlers/EmailVerification');
const Login = require('../handlers/Login');
const DeleteAccount = require('../handlers/DeleteAccount');
const GetAllPasswordsAsAClient = require('../handlers/GetAllPasswordsAsAClient');
const GetPasswordByID = require('../handlers/GetPasswordByID');
const CreatePasswordAsAClient = require('../handlers/CreatePasswordAsAClient');
const DeletePassword = require('../handlers/DeletePassword');
const UpdateAsAClient = require('../handlers/UpdateAsAClient');
const ResendEmail = require('../handlers/ResendEmail');
const Verify2FACode = require('../handlers/Verify2FACode');
const TwoFASetup = require('../handlers/TwoFASetup');
const SearchAccounts = require('../handlers/SearchAccounts');
const SearchAccountInfoByID = require('../handlers/SearchAccountInfoByID');
const CreatePasswordInAnotherAccount = require('../handlers/CreatePasswordInAnotherAccount');
const UpdateAsAnAdmin = require('../handlers/UpdateAsAnAdmin');



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
router.delete('/account/:account_id', VerifyToken, AccountExistByID, AccessTokenType, AdminValidator, AccountExistByURLID, DeleteAccount);

router.get('/verification', VerifyToken, AccountExistByID, EmailSenderTokenType, ResendEmail);
router.get('/verification/:token', VerifyURLToken, AccountExistByID,VerificationTokenType, EmailVerification);

router.post('/twofa', VerifyToken, AccountExistByID, TwoFATokenType, Verify2FACode);
router.get('/twofa', VerifyToken, AccountExistByID, TwoFATokenType, TwoFASetup);

router.get('/p',VerifyToken, AccountExistByID , AccessTokenType,AccountIsVerified, GetAllPasswordsAsAClient);
router.get('/p/:pass_id', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordExistByIDAndClient, GetPasswordByID);
router.post('/p', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordNameValidator, CreatePasswordAsAClient);
router.put('/p/:pass_id', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordExistByIDAndClient, VerifyUpdatePrivileges, PasswordNameValidator, UpdateAsAClient);
router.delete('/p/:pass_id', VerifyToken, AccountExistByID, AccessTokenType,AccountIsVerified, PasswordExistByIDAndClient, VerifyUpdatePrivileges, DeletePassword);

router.get('/a', VerifyToken, AccountExistByID, AccessTokenType, AccountIsVerified, AdminValidator, SearchAccounts);
router.get('/a/:account_id', VerifyToken, AccountExistByID, AccessTokenType, AccountIsVerified, AdminValidator,AccountExistByURLID, SearchAccountInfoByID);
router.get('/a/:account_id/:pass_id', VerifyToken, AccountExistByID, AccessTokenType, AccountIsVerified, AdminValidator,AccountExistByURLID, PasswordExistByIDAndClient,GetPasswordByID);
router.post('/a/:account_id', VerifyToken, AccountExistByID, AccessTokenType, AccountIsVerified, AdminValidator,AccountExistByURLID, PasswordNameValidator, CreatePasswordInAnotherAccount);
router.put('/a/:account_id/:pass_id', VerifyToken, AccountExistByID, AccessTokenType, AccountIsVerified, AdminValidator,AccountExistByURLID, PasswordNameValidator, UpdateAsAnAdmin);
router.delete('/a/:account_id/:pass_id', VerifyToken, AccountExistByID, AccessTokenType, AccountIsVerified, AdminValidator,AccountExistByURLID, PasswordExistByIDAndClient, VerifyUpdatePrivileges, DeletePassword);
// Middleware para manejar rutas no encontradas
router.use((req, res) => {
    return res.status(404).json({
      error: 'Ruta no encontrada',
      path: req.originalUrl,
      method: req.method
    });
  });

module.exports = router;