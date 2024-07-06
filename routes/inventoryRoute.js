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
router.get("/", utilities.handleErrors(invController.buildInvManagement))

// Route to build New Classification
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification))

// Route Classification Created
router.post("/add-classification",
    classCarValidation.classificationRules(),
    classCarValidation.checkClassData,
    utilities.handleErrors(invController.newClassification)
)

// Route for displaying adding a new car view
router.get("/add-inventory", utilities.handleErrors(invController.buildNewCarForm))

// Route for displaying post new car view
router.post("/add-inventory",
    classCarValidation.carRules(),
    classCarValidation.checkCarData,
    utilities.handleErrors(invController.newCar)
)

module.exports = router;