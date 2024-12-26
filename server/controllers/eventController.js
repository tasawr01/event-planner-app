const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const { name, date, description } = req.body;
  const userId = req.params.userId;

  try {
    const newEvent = new Event({ name, date, description, user: userId });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getEvents = async (req, res) => {
  const userId = req.params.userId;

  try {
    const events = await Event.find({ user: userId });
    res.json(events);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateEvent = async (req, res) => {
  const { name, date, description } = req.body;
  const eventId = req.params.eventId;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { name, date, description },
      { new: true }
    );
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    await Event.findByIdAndDelete(eventId);
    res.status(200).send("Event deleted successfully");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
