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
    (req,res) =>{
        res.status(200).send('login process')
    }
)

module.exports = router;
