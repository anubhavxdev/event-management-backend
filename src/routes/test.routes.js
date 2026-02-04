const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/admin",
  protect,
  restrictTo("ADMIN"),
  (req, res) => {
    res.json({
      status: "success",
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/volunteer",
  protect,
  restrictTo("VOLUNTEER", "ADMIN"),
  (req, res) => {
    res.json({
      status: "success",
      message: "Welcome Volunteer",
    });
  }
);

router.get(
  "/attendee",
  protect,
  restrictTo("ATTENDEE"),
  (req, res) => {
    res.json({
      status: "success",
      message: "Welcome Attendee",
    });
  }
);

module.exports = router;
