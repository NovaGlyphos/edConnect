const Event = require("../models/Event");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("registeredUsers", "name")
      .sort({ date: 1 }); // Sort by date ascending for upcoming events first

    const mappedEvents = events.map((event) => ({
      ...event._doc,
      registered: event.registeredUsers.some((user) =>
        user._id.toString() === req.user._id.toString()
      ),
    }));

    res.json(mappedEvents);
  } catch (error) {
    console.error("Get events error:", error.message);
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

const createEvent = async (req, res) => {
  if (req.user.role !== "educator") {
    return res.status(403).json({ message: "Only educators can create events" });
  }

  const { title, date, time, location, description } = req.body;

  // Basic validation
  if (!title || !date || !time || !location) {
    return res.status(400).json({ message: "Title, date, time, and location are required" });
  }

  try {
    const event = new Event({
      title,
      date, // Expected format: "YYYY-MM-DD"
      time, // Expected format: "HH:MM"
      location,
      description: description || "",
      organizer: req.user.name,
      organizerId: req.user._id,
      registeredUsers: [],
    });

    const savedEvent = await event.save();
    req.io.emit("newEvent", savedEvent); // Emit to all connected clients for real-time updates
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Create event error:", error.message);
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

const registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    req.io.to(event.organizerId.toString()).emit("eventRegistration", {
      eventId,
      userId: req.user._id,
      message: `User ${req.user.name} registered for event ${event.title}`,
      event,
    });

    res.json({ message: "Registered successfully", event });
  } catch (error) {
    console.error("Register for event error:", error.message);
    res.status(500).json({ message: "Failed to register", error: error.message });
  }
};

module.exports = { getEvents, createEvent, registerForEvent };