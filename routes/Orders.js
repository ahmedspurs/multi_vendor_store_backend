const express = require("express");
const router = express.Router();
const {
    getOrders,
    getOrdersById,
    createOrders,
    updateOrders,
    deleteOrders,
    paginate,
    userOrdersPaginate,
    search,
} = require("../controllers/Api/OrdersController.js");
router.route("/").get(getOrders).post(createOrders);
router.route("/paginate").post(paginate);
router.route("/user-orders/paginate").post(userOrdersPaginate);
router.route("/search").post(search);
router.route("/:id").get(getOrdersById).put(updateOrders).delete(deleteOrders);
module.exports = router;
