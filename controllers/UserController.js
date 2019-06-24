const User = require('../models/UserModel')

module.exports = {
  // 注册一个用户
  create: function create(user, cb) {
    return User.create(user, cb)
  },
  // 根据用户名获取单个用户信息
  getUserByName: function getUserByName(userName, cb) {
    return User.findOne({ userName: userName }, cb)
  },
  // 根据用户名获取所有用户信息
  getUsersByName: function getUsersByName(userName, cb) {
    return User.find({userName: {$regex: new RegExp(userName)}}, cb)
  },
  // 根据id获取用户信息
  getUserById: function getUserById(id, cb) {
    return User.findById(id, {_id: 1, password: 1}, cb)
  },
  // 根据用户id修改密码
  updatePasswordById: function updatePasswordById(id, password, cb) {
    return User.findOneAndUpdate({_id: id}, {password: password}, cb)
  },
  // 根据用户_id删除特定的用户
  delUserById: function delUserById (id, cb) {
    return User.findByIdAndRemove(id, cb)
  }
}