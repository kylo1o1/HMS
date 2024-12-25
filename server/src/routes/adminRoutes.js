
const {Router} = require('express')
const { addAdmin, addDoctor } = require('../controller/adminController')
const { authentication, authoriazation } = require('../middlewares/auths')

const adminRouter = Router()


adminRouter.route('/addNew').post(addAdmin),
adminRouter.route('/addNewDoctor').post(authentication,authoriazation(['Admin']),addDoctor)



module.exports=adminRouter