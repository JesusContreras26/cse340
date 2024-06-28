const utilities = require("../utilities/")
const errorController = {}

errorController.buildErrorPage = async function (req, res, next){
    next({status: 500})
}

module.exports = errorController