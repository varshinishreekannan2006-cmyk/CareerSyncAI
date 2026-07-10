const express = require("express");
const router = express.Router();

const ResumeHistory = require("../models/ResumeHistory");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/test", (req, res) => {
  res.json({ message: "History route working" });
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const history = await ResumeHistory.find({
      userId: req.user.id,
    }).sort({ analyzedAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete logged-in user's history
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await ResumeHistory.deleteMany({
      userId: req.user.id,
    });

    res.json({
      message: "History deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;