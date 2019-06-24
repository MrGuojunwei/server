
module.exports = function (app) {
  app.use('/signin', require('./signin'))
  app.use('/user', require('./user'))
}