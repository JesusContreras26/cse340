const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

/* ***********************
 * Login route
 *************************/
router.get('/login', utilities.handleErrors(accountController.buildLogin))

/* ***********************
 * Register route
 *************************/
router.get('/register', utilities.handleErrors(accountController.buildRegister))

/* ***********************
 * Registered succesfully
 *************************/
router.post('/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

router.post('/login',
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get('/', utilities.checkUserLogin, utilities.handleErrors(accountController.accountLoginSucess))

router.get('/update', utilities.handleErrors(accountController.buildUpdateAccView))

router.post('/update-data', 
    regValidate.updateDataRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccInformation))

router.post('/update-pass',
    regValidate.passwordRules(),
    regValidate.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword))

router.get('/logout', utilities.handleErrors(accountController.accountLogout))

module.exports = router;
