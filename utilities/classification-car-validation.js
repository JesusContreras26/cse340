const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
 validate.classificationRules = () =>{
    return[
        //Classification name required no spaces, no especial characters
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isAlphanumeric()
            .withMessage("Please provide a valid classification name"),
    ]
 }

 /* ******************************
 * Check data and return errors or continue to build the new Classification
 * ***************************** */
validate.checkClassData = async (req, res, next) =>{
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Vehicle Management",
            nav,
            classification_name
        })
        return
    }
    next()
}

/*  **********************************
  *  Car Data Validation Rules
  * ********************************* */
validate.carRules = () =>{
    return[
        //Classification name
        body("classification_id")
            .notEmpty()
            .isLength({min: 1})
            .isAlphanumeric()
            .withMessage("Select a classification name"),

        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 3})
            .isAlpha()
            .withMessage("Introduce at least 3 characters make"),

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 3})
            .isAlpha()
            .withMessage("Introduce at least 3 character model"),
        
        body("inv_description")
            .escape()
            .trim()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Introduce a valid description"),

        body("inv_image")
            .escape()
            .trim()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Introduce a correct path"),

        body("inv_thumbnail")
            .escape()
            .trim()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Introduce a correct path"),

        body("inv_price")
            .escape()
            .trim()
            .notEmpty()
            .isLength({min:1})
            .isNumeric()
            .withMessage("Introduce a valid price"),

        body("inv_year")
            .escape()
            .trim()
            .notEmpty()
            .isLength({min:4})
            .isNumeric()
            .withMessage("Introduce a valid Year"),

        body("inv_miles")
            .escape()
            .trim()
            .notEmpty()
            .isLength({min:0})
            .isNumeric()
            .withMessage("Introduce a valid mileage"),

        body("inv_color")
            .escape()
            .trim()
            .notEmpty()
            .isAlpha()
            .isLength({min:1})
            .withMessage("Introduce a valid color")
    ]
}

 /* ******************************
 * Check data and return errors or continue to build the new Classification
 * ***************************** */
validate.checkCarData = async (req, res ,next) =>{
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        let dropDown = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory",{
            errors,
            title: "Add a New Car",
            nav,
            dropDown,
            inv_make,
            inv_model,
            inv_description,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

 /* ******************************
 * Check data and return errors or continue to update the data on the database
 * ***************************** */
validate.checkUpdateData = async (req, res ,next) =>{
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        let dropDown = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory",{
            errors,
            title: "Edit Car " + inv_make + " " + inv_model,
            nav,
            dropDown,
            inv_make,
            inv_model,
            inv_description,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            inv_id
        })
        return
    }
    next()
}

/*  **********************************
  *  Review text Data Validation Rules
  * ********************************* */
validate.reviewRules = () =>{
    return[
        //Classification name required no spaces, no especial characters
        body("review_text")
            .escape()
            .trim()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Introduce a valid description"),
    ]
 }

  /* ******************************
 * Check data and return errors or continue to update the data on the database
 * ***************************** */
validate.checkReviewData = async (req, res ,next) =>{
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        const {inv_id} = req.body
        const data = await invModel.getInventoryByInventoryId(inv_id)
        let grid
        grid = await utilities.buildCarGridUser(data, res.locals.accountData)
        let nav = await utilities.getNav()
        res.render("./inventory/car",{
            title: data[0].inv_year + ' ' + data[0].inv_make + " " +data[0].inv_model,
            nav,
            grid,
            errors
        })
        return  
    }
    next()
}

validate.checkReviewEditData = async (req, res ,next) =>{
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        const nav = await utilities.getNav()
        const {review_id, review_date, inv_id, review_text} = req.body
        const carResult = await invModel.getInventoryByInventoryId(inv_id)
        const carData = carResult[0]
        res.render("inventory/edit-review", {
            title: "Edit " +  carData.inv_year + " " + carData.inv_make + " " + carData.inv_model + " Review",
            errors,
            nav,
            review_date,
            review_text,
            review_id,
            inv_id
        })
        return  
    }
    next()
}

module.exports = validate