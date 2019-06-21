const { User } = require('../lib/mongoose')

module.exports = {
  // 注册一个用户
  create: function create(user, cb) {
    return User.create(user, cb)
  },
  // 根据用户名获取用户信息
  getUserByName: function getUserByName(userName) {
    return User.findOne({ userName: userName })
  }
}