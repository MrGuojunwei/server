const mongoose = require('mongoose')
const path = require('path')
const config = require('config-lite')(path.join(__dirname, '..'))

const Schema = mongoose.Schema

mongoose.connect(config.mongodb)

const UserSchema = new Schema({
  userName: { type: String },
  password: { type: String },
  gender: { type: String, enum: ['m', 'f', 'x'] },
  description: { type: String, required: true },
  createTime: {type: Date, default: new Date()}
})

const User = mongoose.model('User', UserSchema)

module.exports = User