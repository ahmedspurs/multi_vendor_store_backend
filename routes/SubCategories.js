const express = require("express");
const router = express.Router();
const {
    getSubCategories,
    getSubCategoriesById,
    createSubCategories,
    updateSubCategories,
    deleteSubCategories,
    paginate,
    search,
} = require("../controllers/Api/SubCategoriesController.js");
router.route("/").get(getSubCategories).post(createSubCategories);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getSubCategoriesById)
    .put(updateSubCategories)
    .delete(deleteSubCategories);
module.exports = router;
