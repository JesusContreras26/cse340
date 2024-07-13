const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***********************
 * Deliver login view
 *************************/
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ***********************
 * Deliver register view
 *************************/
async function buildRegister(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ***********************
 * Process Registration
 *************************/
async function registerAccount(req, res){
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password, } = req.body

    // Hash the password before storing
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry there was an error processing the registration.')
        res.status(500).render("account/register",{
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult){
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).redirect("/account/login")
    } else{
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res){
    let nav = await utilities.getNav()
    const{account_email, account_password} = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
    return
    }
    try {
        if(await bcrypt.compare(account_password, accountData.account_password)){
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else{
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
        return res.redirect("/account/")
        } else{
            return req.flash("notice", "Please check your credentials and try again"), res.redirect("/account/login")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

/* ****************************************
 *  Display Management view
 * ************************************ */
async function accountLoginSucess(req, res){
    let nav = await utilities.getNav()
    res.render("account/login-sucess", {
        title: "Account Management",
        errors: null,
        nav
    })
}

/* ****************************************
 *  Display Update Account View
 * ************************************ */
async function buildUpdateAccView (req, res, next) {
    const nav = await utilities.getNav()
    res.render("account/update-account", {
        title: "Edit Account",
        errors: null,
        nav
    })
}

/* ****************************************
 *  Update Account Data 
 * ************************************ */
async function updateAccInformation (req, res, next){
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, parseInt(account_id))
    const accountData = await accountModel.getAccountById(account_id)

    if (updateResult) {
        try {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else{
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            
        } catch (error) {
            return new Error('Access Forbidden')
        }
        req.flash('notice', 'Congratulations, your information has been updated')
        res.status(201).render('account/login-sucess',{
            title: "Account Management",
            errors: null,
            nav
        })
    } else{
        req.flash('notice', 'Sorry the updating process failed')
        res.status(501).render('account/update-account',{
            title: 'Edit Account',
            errors: null,
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

/* ****************************************
 *  Update Account Password 
 * ************************************ */
async function updatePassword(req, res, next){
    const nav = await utilities.getNav()
    const {account_password, account_id} = req.body
        // Hash the password before storing
        try {
            // regular password and cost (salt is generated automatically)
            hashedPassword = await bcrypt.hashSync(account_password, 10)
        } catch (error) {
            req.flash("notice", 'Sorry there was an error updating the account.')
            res.status(500).render("account/update-account",{
                title: "Edit Account",
                nav,
                errors: null,
            })
        }

    const updatePassResult = await accountModel.updatePassword(hashedPassword, parseInt(account_id))

    if (updatePassResult) {
        req.flash('notice', 'Congratulations, your information has been updated')
        res.status(201).render('account/login-sucess',{
            title: "Account Management",
            errors: null,
            nav
        })
    }else{
        req.flash('notice', 'Sorry the updating process failed')
        res.status(501).render('account/update-account',{
            title: 'Edit Account',
            errors: null,
            nav
        })
    }

}

/* ****************************************
 *  Account logout
 * ************************************ */
async function accountLogout(req, res, next){
    res.clearCookie("jwt")
    res.redirect('/')
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, accountLoginSucess, buildUpdateAccView, updateAccInformation, updatePassword, accountLogout }