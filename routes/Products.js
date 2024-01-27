const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductsById,
    createProducts,
    updateProducts,
    deleteProducts,
    paginate,
    search,
    searchByCategoryId,
    paginateByCategoryId,
    paginateByVendorId,
    searchByVendorId,
} = require("../controllers/Api/ProductsController.js");
router.route("/").get(getProducts).post(createProducts);
router.route("/paginate").post(paginate);
router.route("/by-category-id/paginate").post(paginateByCategoryId);
router.route("/by-vendor-id/paginate").post(paginateByVendorId);
router.route("/search").post(search);
router.route("/by-category-id/search").post(searchByCategoryId);
router.route("/by-vendor-id/search").post(searchByVendorId);
router
    .route("/:id")
    .get(getProductsById)
    .put(updateProducts)
    .delete(deleteProducts);
module.exports = router;
