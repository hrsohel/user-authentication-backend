const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, unique: true },
  token: { type: String, required: true },
}, {timestamps: true});

const User = mongoose.model("Session", sessionSchema)

module.exports = User