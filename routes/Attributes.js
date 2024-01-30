const express = require("express");
const router = express.Router();
const {
    getAttributes,
    getAttributesById,
    createAttributes,
    updateAttributes,
    deleteAttributes,
    paginate,
    search,
} = require("../controllers/Api/AttributesController.js");
router.route("/").get(getAttributes).post(createAttributes);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getAttributesById)
    .put(updateAttributes)
    .delete(deleteAttributes);
module.exports = router;
