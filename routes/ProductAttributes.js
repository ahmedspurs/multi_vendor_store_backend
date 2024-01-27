const express = require("express");
const router = express.Router();
const {
    getProductAttributes,
    getProductAttributesById,
    createProductAttributes,
    updateProductAttributes,
    deleteProductAttributes,
    paginate,
    search,
} = require("../controllers/Api/ProductAttributesController.js");
router.route("/").get(getProductAttributes).post(createProductAttributes);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getProductAttributesById)
    .put(updateProductAttributes)
    .delete(deleteProductAttributes);
module.exports = router;
