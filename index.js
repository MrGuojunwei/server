const express = require('express')
const bodyParser = require('body-parser')
const config = require('config-lite')(__dirname)
const pkg = require('./package.json')
const routes = require('./routes')

const app = express()

// create application/json parser
const jsonParser = bodyParser.json()

// create applicationo/x-www.form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

routes(app)

app.listen(config.port, function () {
  console.log(`${pkg.name} 监听端口 ${config.port}`)
})