const bcrypt = require('bcrypt')

exports.hashPassword = async (params) => {
    return await bcrypt.hash(params,10)
}

exports.verifyPassword = async (enteredPassword, existingPassword) => {
    
    return await bcrypt.compare(enteredPassword,existingPassword)

}