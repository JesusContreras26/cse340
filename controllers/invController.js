const { parse } = require("dotenv")
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
    let grid
    if (res.locals.loggedin) {
        grid = await utilities.buildCarGridUser(data, res.locals.accountData)
    }else{
        grid = await utilities.buildCarGridVisitor(data)
    }
    let nav = await utilities.getNav()
    const carName = data[0].inv_year + ' ' + data[0].inv_make + " " +data[0].inv_model
    res.render("./inventory/car",{
        title: carName,
        nav,
        grid,
    })
    
}

/* **************************************
* Build Inventory Management view
* ************************************ */
invCont.buildInvManagement = async function(req, res, next){
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Vehicle Mangement",
        nav,
        errors: null,
        classificationSelect
    })
}

/* **************************************
* Build Add New Classification view
* ************************************ */
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

/* **************************************
* Build Add New Car view
* ************************************ */

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
    const classificationSelect = await utilities.buildClassificationList()
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

    const createCarResult = await invModel.createNewCar(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    if (createCarResult) {
        req.flash("notice", `Congratulations the new car ${inv_make} ${inv_model} has been created`)
        res.status(201).render("inventory/management",{
            title: "Vehicle Management",
            nav,
            errors: null,
            classificationSelect
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) =>{
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if(invData[0].inv_id){
        return res.json(invData)
    } else{
        next(new Error("No data returned"))
    }
}

/* *********
 *  Display Edit view
 * ********** */
invCont.displayEditView = async function(req, res, next){
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id) 
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const dropDown = await utilities.buildClassificationList(itemData[0].classification_id)
    const name = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("inventory/edit-inventory",{
        title:"Edit Car " + name,
        nav,
        dropDown,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        classification_id: itemData[0].classification_id
    })
}

/* *********
 *  Update the data of the new car in the database and give back an answer
 * ********** */
invCont.updateInventory = async function(req, res){
    const nav = await utilities.getNav()
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id} = req.body

    const updateResult = await invModel.updateInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id)
    if (updateResult) {
        req.flash("notice", `The ${inv_make} ${inv_model} was successfully updated.`)
        res.redirect("/inv/")
    } else{
        const dropDown = await utilities.buildClassificationList(classification_id)
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory",{
            title: "Edit Car " + inv_make + " " + invModel,
            nav,
            errors: null,
            dropDown,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            inv_id
        })
    }

}

/* *********
 *  Display Delete view
 * ********** */
invCont.displayDeleteView = async function(req, res, next){
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id) 
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const name = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("inventory/delete-confirm",{
        title:"Delete Car: " + name,
        nav,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_price: itemData[0].inv_price,
    })
}

/* *********
 *  Delete the data of the car in the database and give back an answer
 * ********** */
invCont.deleteCar = async function(req, res){
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id) 

    const updateResult = await invModel.deleteInventoryCar(inv_id)
    if (updateResult) {
        req.flash("notice", `The car was successfully deleted.`)
        res.redirect("/inv/")
    } else{
        req.flash("notice", "Sorry, the process of deleting failed.")
        res.redirect("/inv/delete/inv_id")
    }

}

/* *********
 *  Create a new Review
 * ********** */

invCont.sendReview = async function(req, res, next){
    const nav = await utilities.getNav()
    const {review_text, inv_id, account_id} = req.body

    const reviewResult = await invModel.createNewReview(review_text, inv_id, account_id)
    
    if (reviewResult) {
        req.flash("notice", "The review was added")
        res.redirect(`/inv/detail/${inv_id}`)
    }else{
        req.flash("notice", "There was an error creating your review")
        res.redirect(`/inv/detail/${inv_id}`)
    }

}

module.exports = invCont