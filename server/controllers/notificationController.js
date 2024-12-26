const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  try {
    const newNotification = new Notification({ message, user: userId });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    const notifications = await Notification.find({ user: userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
