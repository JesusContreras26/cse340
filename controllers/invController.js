const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildClassificationId = async function (req, res, next) {
    const classfication_id = req.params.classficationId
    const data = await invModel.getInventoryByClassificationId(classfication_id)
    const grid = await utilities.buildClassificatioGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

module.exports = invCont