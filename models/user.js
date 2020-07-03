var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  socketId: {
    type: String
  },
  status: {
    type: String,
    required: true
  }
});

const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline'
}

module.exports = {
  User: mongoose.model('user', UserSchema),
  UserStatus: USER_STATUS
};