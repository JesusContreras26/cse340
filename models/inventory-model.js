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
        return data.rows;
    } catch (error) {
        console.error("getinventorybyid error " + error)
    }
}

async function createNewClassification(classification_name){
    try {
        const sql = `INSERT INTO public.classification(classification_name) VALUES ($1) RETURNING *`
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error
    }
}

async function createNewCar(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
    try {
        const sql = `INSERT INTO public.inventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    } catch (error) {
        return error
    }
}


module.exports = {getClassification, getInventoryByClassificationId, getInventoryByInventoryId, createNewClassification, createNewCar}