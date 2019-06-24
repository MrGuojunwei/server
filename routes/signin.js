const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()
const rtnData = require('../lib/rtnData')
const md5 = require('md5-node')

// 登录接口  userName  password
router.post('/', function (req, res, next) {
    const userName = req.body.userName
    const password = req.body.password

    // 校验参数
    try {
        if (!userName) {
            throw new Error('用户名不能为空')
        }
        if (!password) {
            throw new Error('密码不能为空')
        }
    } catch (e) {
        res.send(rtnData('100002', null, e.message))
    }

    UserController.getUserByName(userName, function (err, user) {
        if (err) {
            res.send(renData('100001', null, err.message))
        }
        if (!user) {
            res.send(rtnData('100003', null, '用户不存在'))
        } else if (user.password !== md5(password)) {
            res.send(rtnData('100004', null, '密码错误'))
        } else {
            let returnData = {
                userName: user.userName,
                gender: user.gender,
                description: user.description
            }
            res.send(rtnData('000000', returnData, '登录成功'))
        }
    })
})

module.exports = router