const Message = require("../models/Message");

// send message
exports.sendMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;
  console.log("Received Message Payload:", req.body); // 💥 Add this line
  try {
    const newMsg = await Message.create({ sender, receiver, content });
    res.status(201).json(newMsg);
  } catch (err) {
    console.error("Send message error:", err); // 💥 Add this
    res.status(500).json({ msg: "Failed to send message", err });
  }
};

// get messages between two users
exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get messages", err });
  }
};
