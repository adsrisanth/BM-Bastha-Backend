const express = require("express");
const router = express.Router();

const bannerController = require("../../controller/admin/bannerController");

router.put("/add", bannerController.addNewBanner);

router.get("/list/all", bannerController.getAllBanners);

router.get("/list/active", bannerController.getActiveBanners);

router.patch("/update", bannerController.updateBanner);

router.delete("/remove/:banner_id?", bannerController.removeBanner);

module.exports = router;
