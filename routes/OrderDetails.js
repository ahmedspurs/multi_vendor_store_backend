
const express = require('express')
const router = express.Router();
const { getOrderDetails, getOrderDetailsById, createOrderDetails,
    updateOrderDetails, deleteOrderDetails,paginate,search} =require('../controllers/Api/OrderDetailsController.js')
router.route('/').get(getOrderDetails).post(createOrderDetails)
router.route('/paginate').post(paginate)
router.route('/search').post(search)
router.route('/:id').get(getOrderDetailsById).put(updateOrderDetails).delete(deleteOrderDetails);
module.exports = router;

