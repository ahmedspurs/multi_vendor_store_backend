const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUsersById,
    register,
    updateUsers,
    deleteUsers,
    paginate,
    vendorsPaginate,
    getVendors,
    search,
    login,
    createVendor,
    updatePass,
} = require("../controllers/Api/UsersController.js");
router.route("/").get(getUsers).post(register);

router.route("/login").post(login);
router.route("/create-vendor").post(createVendor);
router.route("/edit-pass").post(updatePass);
// router.route("/paginate").post(paginate);
router.route("/vendors/paginate").post(vendorsPaginate);
router.route("/vendors").get(getVendors);
router.route("/search").post(search);
router.route("/:id").get(getUsersById).put(updateUsers).delete(deleteUsers);
module.exports = router;
