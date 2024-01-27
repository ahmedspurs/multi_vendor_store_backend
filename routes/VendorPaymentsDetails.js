const express = require("express");
const router = express.Router();
const {
    getVendorPaymentsDetails,
    getVendorPaymentsDetailsById,
    createVendorPaymentsDetails,
    updateVendorPaymentsDetails,
    deleteVendorPaymentsDetails,
    paginate,
    search,
} = require("../controllers/Api/VendorPaymentsDetailsController.js");
router
    .route("/")
    .get(getVendorPaymentsDetails)
    .post(createVendorPaymentsDetails);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getVendorPaymentsDetailsById)
    .put(updateVendorPaymentsDetails)
    .delete(deleteVendorPaymentsDetails);
module.exports = router;
