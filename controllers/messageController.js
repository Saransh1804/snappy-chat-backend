const Messages = require("../Models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      // console.log(msg);
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        id:msg._id,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    // console.log("dlt")
    const messageId = req.params.id; // Assuming the message ID is passed as a route parameter
    // console.log(messageId)
    const deletedMessage = await Messages.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};