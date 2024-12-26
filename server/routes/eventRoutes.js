const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create-event/:userId", createEvent);
router.get("/events/:userId", getEvents);
router.put("/update-event/:eventId", updateEvent);
router.delete("/delete-event/:eventId", deleteEvent);

module.exports = router;
