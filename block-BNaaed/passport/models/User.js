var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    photo: String,
  },
  { timestamps: true }
);

var model = mongoose.model('User', userSchema);
module.exports = model;
