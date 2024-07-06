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

invCont.buildInvManagement = async function(req, res, next){
    const nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Vehicle Mangement",
        nav,
        errors: null
    })
}

invCont.buildNewClassification = async function(req, res, next){
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null
     })
}

invCont.newClassification = async function(req, res){
    const nav  = await utilities.getNav()
    const { classification_name } = req.body

    const createClassResult = await invModel.createNewClassification(classification_name)

    if (createClassResult) {
        req.flash("notice", `Congratulations the new classification ${classification_name} has been created`)
        res.status(201).render("inventory/management",{
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else{
        req.flash("notice", "The creation of the new classification has failed")
        res.status(501).render("inventory/add-classification",{
            title: "Add New Classification",
            nav,
            errors: null
        })
    }
}

invCont.buildNewCarForm = async function(req, res, next){
    const nav = await utilities.getNav()
    const dropDown = await utilities.buildClassificationList()
    res.render("inventory/add-inventory",{
        title:"Add New Car",
        nav,
        errors: null,
        dropDown
    })
}

invCont.newCar = async function(req, res){
    const nav = await utilities.getNav()
    const dropDown = await utilities.buildClassificationList()
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

    const createCarResult = await invModel.createNewCar(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    if (createCarResult) {
        req.flash("notice", `Congratulations the new car ${inv_make} ${inv_model} has been created`)
        res.status(201).render("inventory/management",{
            title: "Vehicle Management",
            nav,
            errors: null
        })
    } else{
        req.flash("notice", "The creation of a new car has failed")
        res.status(501).render("inventory/add-inventory",{
            title: "Add New Car",
            nav,
            errors: null,
            dropDown,
        })
    }

}

module.exports = invCont