const express = require("express");
const router = express.Router();
const {
    getCities,
    getCitiesById,
    createCities,
    updateCities,
    deleteCities,
    paginate,
    search,
} = require("../controllers/Api/CitiesController.js");
router.route("/").get(getCities).post(createCities);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/:id").get(getCitiesById).put(updateCities).delete(deleteCities);
module.exports = router;
