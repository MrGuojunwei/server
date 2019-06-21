const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const sha1 = require('sha1')
const rtnData = require('../lib/rtnData')

const UserModel = require('../models/UserModel')

const jsonParser = bodyParser.json()

router.post('/', jsonParser, function (req, res, next) {
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
      // 密码加密
      password = sha1(password)

      // 待写入数据库的用户信息
      let user = {
        userName: userName,
        password: password,
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