var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  userId:String,
  uname: String,
  sname: String,
  uemail: String,
  gender: String,
  ucourses: String,
  uphno: Number,
  place: String,
  addr: String,
  imgpath: String,
  imgtoken: String,
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema,'userdata');


