

const {Router} = require('express')
const { login } = require('../controller/loginLogout')

const userRoutes = Router()



userRoutes.route('/login').post(login)


module.exports = userRoutes