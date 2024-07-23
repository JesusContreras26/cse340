const pool = require("../database")

/* ***********************
 * Register new account
*  *********************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email){
    try {
        const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* **************************************
* Update Account Data
* ************************************ */
async function updateAccount(account_firstname, account_lastname, account_email, account_id){
    try {
        const sql = `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* **************************************
* Update Password Data
* ************************************ */
async function updatePassword(account_password, account_id){
    try {
        const sql = `UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *`
        return await pool.query(sql, [account_password, account_id])
    } catch (error) {
        console.error("model error: " + error)
    }
}

async function getAccountById(account_id){
    try {
        const result = await pool.query('SELECT * FROM account WHERE account_id = $1',
            [account_id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* ***************************
 *  Get all user reviews by account_id
 * ************************** */
async function userReviewsById(account_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.review AS re
            WHERE re.account_id = $1`,
            [account_id]
        )
        return data.rows;
    } catch (error) {
        console.error("getinventorybyid error " + error)
    }
}

/* ***************************
 *  Get Review by review_id
 * ************************** */
async function userReviewsByReviewId(review_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.review AS re
            WHERE re.review_id = $1`,
            [review_id]
        )
        return data.rows;
    } catch (error) {
        console.error("getinventorybyid error " + error)
    }
}

/* **************************************
* Delete a review by review_id
* ************************************ */
async function deleteReview(review_id){
    try {
        const sql = `DELETE FROM public.review WHERE review_id = $1`
        return await pool.query(sql, [review_id])
    } catch (error) {
        new Error("Delete Inventory Error")
    }
}

async function updateReview(review_id, review_text){
    try {
        const sql = `UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *`
        return await pool.query(sql, [review_text, review_id])
    } catch (error) {
        console.error("model error: " + error)
    }
}
module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, updatePassword, getAccountById, userReviewsById, userReviewsByReviewId, deleteReview, updateReview }