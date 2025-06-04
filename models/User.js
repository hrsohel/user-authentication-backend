const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shops: [{ type: String, required: true }],
  userIdBase64: {type: String, default: null}
});

const User = mongoose.model("User", userSchema)

module.exports = User