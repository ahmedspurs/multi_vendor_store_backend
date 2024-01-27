const express = require("express");
const router = express.Router();
const {
    getAds,
    getAdsById,
    createAds,
    updateAds,
    deleteAds,
    paginate,
    search,
} = require("../controllers/Api/AdsController.js");
router.route("/").get(getAds).post(createAds);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/:id").get(getAdsById).put(updateAds).delete(deleteAds);
module.exports = router;
