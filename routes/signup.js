const express = require('express')
const router = express.Router()
const md5 = require('md5-node')
const rtnData = require('../lib/rtnData')

const UserModel = require('../models/UserModel')

router.post('/', function (req, res, next) {
  const userName = req.body.userName // 用户名
  const password = req.body.password // 密码
  const repassword = req.body.repassword // 重复确认密码
  const gender = req.body.gender // 性别
  const description = req.body.description // 个人简介

  // 校验参数
  try {
    if (password !== repassword) {
      throw new Error('两次密码输入不一致')
    }
    if (!description) {
      throw new Error('缺少个人简介')
    }
  } catch (e) {
    res.send(rtnData('100001', null, e.message))
  }

  UserModel.getUserByName(userName).exec(function (err, user) {
    if (err) {
      res.send(rtnData('100001', null, err.message))
    } else if (user) {
      res.send(rtnData('100001', null, '用户名已存在'))
    } else {

      // 待写入数据库的用户信息
      let user = {
        userName: userName,
        password: md5(password),
        gender: gender,
        description: description
      }

      UserModel.create(user, function (err, user) {
        if (err) {
          // 注册失败
          res.send(rtnData('100001', null, '数据库错误'))
        } else {
          // 此user是插入mongodb后的值，包含 _id
          res.send(rtnData(null, null, '注册成功'))
        }
      })
    }
  })
})

module.exports = router