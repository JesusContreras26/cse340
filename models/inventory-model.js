const pool = require("../database")

/* ***********************
 * Get all classifications data
*  *********************** */
async function getClassification(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classfication_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classfication_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationbyid error " + error)
    }
}

/* **************************************
* Get all the information of the car requested
* ************************************ */

async function getInventoryByInventoryId(inv_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        console.log(data.rows)
        return data.rows;
    } catch (error) {
        console.error("getinventorybyid error " + error)
    }
}

/* **************************************
* Create a new classification in the classification table
* ************************************ */
async function createNewClassification(classification_name){
    try {
        const sql = `INSERT INTO public.classification(classification_name) VALUES ($1) RETURNING *`
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error
    }
}

/* **************************************
* Create a new car in the inventory
* ************************************ */
async function createNewCar(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
    try {
        const sql = `INSERT INTO public.inventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    } catch (error) {
        return error
    }
}

/* **************************************
* Update an item in the inventory
* ************************************ */
async function updateInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id){
    try {
        const sql = `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`
        return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* **************************************
* Delete an item in the inventory
* ************************************ */
async function deleteInventoryCar(inv_id){
    try {
        const sql = `DELETE FROM public.inventory WHERE inv_id = $1`
        return await pool.query(sql, [inv_id])
    } catch (error) {
        new Error("Delete Inventory Error")
    }
}

/* **************************************
* Select all users reviews
* ************************************ */
async function getUsersReviews(inv_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.review AS re
            WHERE re.inv_id = $1`,
            [inv_id]
        )
        console.log(data.rows)
        return data.rows;
    } catch (error) {
        console.error("getinventorybyid error " + error)
    }
}

/* **************************************
* Create a new review
* ************************************ */
async function createNewReview(review_text, inv_id, account_id){
    try {
        const sql = `INSERT INTO public.review(review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *`
        return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
        return error
    }
}
module.exports = {getClassification, getInventoryByClassificationId, getInventoryByInventoryId, createNewClassification, createNewCar, updateInventory, deleteInventoryCar, getUsersReviews, createNewReview}