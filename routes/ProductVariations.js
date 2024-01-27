const express = require("express");
const router = express.Router();
const {
    getProductVariations,
    getProductVariationsById,
    createProductVariations,
    updateProductVariations,
    deleteProductVariations,
    paginate,
    search,
} = require("../controllers/Api/ProductVariationsController.js");
router.route("/").get(getProductVariations).post(createProductVariations);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getProductVariationsById)
    .put(updateProductVariations)
    .delete(deleteProductVariations);
module.exports = router;
