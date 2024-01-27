const express = require("express");
const router = express.Router();
const {
    getSuccessPartners,
    getSuccessPartnersById,
    createSuccessPartners,
    updateSuccessPartners,
    deleteSuccessPartners,
    paginate,
    search,
} = require("../controllers/Api/SuccessPartnersController.js");
router.route("/").get(getSuccessPartners).post(createSuccessPartners);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getSuccessPartnersById)
    .put(updateSuccessPartners)
    .delete(deleteSuccessPartners);
module.exports = router;
