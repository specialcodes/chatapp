const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  messages: [Object]
});

module.exports = mongoose.model('chat', ChatSchema);