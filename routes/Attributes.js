const express = require("express");
const router = express.Router();
const {
    getAttributes,
    getAttributesById,
    createAttributes,
    updateAttributes,
    deleteAttributes,
    paginate,
    paginateByVendor,
    search,
} = require("../controllers/Api/AttributesController.js");
router.route("/").get(getAttributes).post(createAttributes);
router.route("/paginate").post(paginate);
router.route("/by-vendor-id/paginate").post(paginateByVendor);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getAttributesById)
    .put(updateAttributes)
    .delete(deleteAttributes);
module.exports = router;
