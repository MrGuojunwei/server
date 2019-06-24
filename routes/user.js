const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()
const rtnData = require('../lib/rtnData')
const md5 = require('md5-node')

// 新增用户
router.post('/add', function (req, res, next) {
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

  UserController.getUserByName(userName, function (err, user) {
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

      UserController.create(user, function (err, user) {
        if (err) {
          // 注册失败
          res.send(rtnData('100001', null, '数据库错误'))
        }
        // 此user是插入mongodb后的值，包含 _id
        res.send(rtnData(null, null, '添加成功'))
      })
    }
  })
})

// 删除用户
router.post('/remove', function (req, res, next) {
  const id = req.body.id
  try {
    if (!id) {
      throw new Error('id不能为空')
    }
  } catch (e) {
    res.send(rtnData('100001', null, e.message))
  }

  UserController.delUserById(id, function (err, doc) {
    console.log('doc', doc)
    if (err) {
      res.send(rtnData('100001', null, err.message))
    }
    res.send(rtnData(null, null, '删除成功'))
  })
})

// 修改密码 先判断输入原始密码是否正确  再判断两次输入的新密码是否一致
router.post('/update_password', function (req, res, next) {
  let oldPassword = req.body.oldPassword
  let newPassword = req.body.newPassword
  let newRepassword = req.body.newRepassword
  let id = req.body.id

  try {
    if (!id) {
      throw new Error('id不能为空')
    }
    if (!oldPassword) {
      throw new Error('请输入旧密码')
    }
    if (!newPassword) {
      throw new Error('请输入新密码')
    }
    if (!newRepassword) {
      throw new Error('请输入重复密码')
    }
  } catch (e) {
    res.send(rtnData('100001', null, e.message))
  }

  UserController.getUserById(id, function (err, user) {
    if (err) {
      res.send(renData('100001', null, err.message))
    }
    if (!user) {
      res.send(rtnData('100003', null, '用户不存在'))
    }
    if (md5(oldPassword) !== user.password) {
      res.send(rtnData('100003', null, '旧密码错误'))
    }
    if (newPassword !== newRepassword) {
      res.send(rtnData('100004', null, '两次输入新密码不一致'))
    }
    UserController.updatePasswordById(id, md5(newPassword), function (err, user) {
      if (err) {
        res.send(rtnData('100001', null, '数据库错误'))
      }
      res.send(rtnData(null, null, '密码修改成功'))
    })
  })
})

// 根据用户名查询用户
router.get('/get', function (req, res, next) {
  let userName = req.body.userName || ''

  UserController.getUsersByName(userName, function (err, users) {
    if (err) {
      res.send(rtnData('100001', null, err.message))
    }
    res.send(rtnData(null, users, '查询用户成功'))
  })
})

module.exports = router
