const fs =require('fs')

exports.unsyncImage = (path)=>{

    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }
}

