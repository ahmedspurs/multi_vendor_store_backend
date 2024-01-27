
const express = require('express')
const router = express.Router();
const { getProductImages, getProductImagesById, createProductImages,
    updateProductImages, deleteProductImages,paginate,search} =require('../controllers/Api/ProductImagesController.js')
router.route('/').get(getProductImages).post(createProductImages)
router.route('/paginate').post(paginate)
router.route('/search').post(search)
router.route('/:id').get(getProductImagesById).put(updateProductImages).delete(deleteProductImages);
module.exports = router;

