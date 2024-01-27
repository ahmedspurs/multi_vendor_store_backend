const express = require("express");
const router = express.Router();
const {
    getCountries,
    getCountriesById,
    createCountries,
    updateCountries,
    deleteCountries,
    paginate,
    search,
} = require("../controllers/Api/CountriesController.js");
router.route("/").get(getCountries).post(createCountries);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getCountriesById)
    .put(updateCountries)
    .delete(deleteCountries);
module.exports = router;
