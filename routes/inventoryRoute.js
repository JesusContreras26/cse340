//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classCarValidation = require("../utilities/classification-car-validation")


// Route to build invetory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build car view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build Inventory Management
router.get("/", 
    utilities.checkUserPrivilege,
    utilities.handleErrors(invController.buildInvManagement))

// Route to build New Classification
router.get("/add-classification", 
    utilities.checkUserPrivilege,
    utilities.handleErrors(invController.buildNewClassification))

// Route Classification Created
router.post("/add-classification",
    classCarValidation.classificationRules(),
    classCarValidation.checkClassData,
    utilities.handleErrors(invController.newClassification)
)

// Route for displaying adding a new car view
router.get("/add-inventory",
    utilities.checkUserPrivilege,
    utilities.handleErrors(invController.buildNewCarForm))

// Route for displaying post new car view
router.post("/add-inventory",
    classCarValidation.carRules(),
    classCarValidation.checkCarData,
    utilities.handleErrors(invController.newCar)
)

// Route for getting cars for a specific classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route for displaying car update view
router.get("/edit/:inv_id", 
    utilities.checkUserPrivilege,
    utilities.handleErrors(invController.displayEditView))

// Route for update the cars with a form in the database
router.post("/update/", 
    classCarValidation.carRules(),
    classCarValidation.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route for displaying car delete view
router.get("/delete/:inv_id", 
    utilities.checkUserPrivilege,
    utilities.handleErrors(invController.displayDeleteView))

// Route for delete a car with in the database
router.post("/delete", utilities.handleErrors(invController.deleteCar))
module.exports = router;