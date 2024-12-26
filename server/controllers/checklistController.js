const Checklist = require('../models/Checklist');

exports.createChecklistItem = async (req, res) => {
  const { title } = req.body;
  const userId = req.params.userId;

  try {
    if (!title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }

    const newChecklist = new Checklist({ title, user: userId });
    await newChecklist.save();
    res.status(201).json(newChecklist);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getChecklistItems = async (req, res) => {
  const userId = req.params.userId;

  try {
    const checklists = await Checklist.find({ user: userId });
    res.json(checklists);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.markChecklistItemComplete = async (req, res) => {
  const { itemId } = req.params;

  try {
    const checklistItem = await Checklist.findById(itemId);

    if (!checklistItem) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    // Toggle completion status
    checklistItem.completed = !checklistItem.completed;
    await checklistItem.save();

    res.json(checklistItem);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


exports.editChecklistItem = async (req, res) => {
  const { itemId } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  try {
    const checklistItem = await Checklist.findById(itemId);

    if (!checklistItem) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    checklistItem.title = title.trim();
    await checklistItem.save();

    res.json(checklistItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


exports.deleteChecklistItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const checklistItem = await Checklist.findById(itemId);

    if (!checklistItem) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    await Checklist.findByIdAndDelete(itemId);
    res.json({ message: 'Checklist item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


