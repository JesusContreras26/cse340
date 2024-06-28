const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classfication_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classfication_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* **************************************
* Build car description view
* ************************************ */

invCont.buildByInventoryId = async function(req, res, next){
    const inventor_id = req.params.invId
    const data = await invModel.getInventoryByInventoryId(inventor_id)
    const grid = await utilities.buildCarGrid(data)
    let nav = await utilities.getNav()
    const carName = data[0].inv_year + ' ' + data[0].inv_make + " " +data[0].inv_model
    res.render("./inventory/car",{
        title: carName,
        nav,
        grid,
    })
    
}

module.exports = invCont