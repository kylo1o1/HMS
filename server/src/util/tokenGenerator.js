
const jwt = require('jsonwebtoken')

exports.generateToken = async (req,res) => {

    try {
        
        const {id,role} = req.user

        const options = {
            id,
            role,
            time:Date.now()
        }

        const token = jwt.sign(options,process.env.SECRET_KEY,{expiresIn:"3hr"})

        return res.status(200).cookie('token',token).json({
            success:true,
            message:`${role} logged In`,
            isAuth : true,
            token,
            user:req.user
        })


    } catch (error) {
        console.error(error.message);
        
        return res.status(500).json({
            success:false,
            message:"Login Error",
            error:error.message
        })
    }


}