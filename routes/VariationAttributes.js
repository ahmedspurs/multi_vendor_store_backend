const express = require("express");
const router = express.Router();
const {
    getVariationAttributes,
    getVariationAttributesById,
    createVariationAttributes,
    updateVariationAttributes,
    deleteVariationAttributes,
    paginate,
    search,
} = require("../controllers/Api/VariationAttributesController.js");
router.route("/").get(getVariationAttributes).post(createVariationAttributes);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
    .route("/:id")
    .get(getVariationAttributesById)
    .put(updateVariationAttributes)
    .delete(deleteVariationAttributes);
module.exports = router;
