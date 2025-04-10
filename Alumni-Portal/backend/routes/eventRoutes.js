const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.getAllEvents);
router.post("/", (req, res) => {
  console.log("POST /api/events triggered");
  eventController.createEvent(req, res);
});
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.post('/upload-excel', 
  eventController.uploadMiddleware, 
  eventController.uploadEventsFromExcel
);
module.exports = router;
