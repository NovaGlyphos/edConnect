const Subject = require("../models/Subject");

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    // If there are no subjects in DB, you might send static default data
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
