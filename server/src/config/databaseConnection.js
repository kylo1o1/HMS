const { default: mongoose } = require("mongoose")


exports.dataBaseConnection = ()=>{
    try {
        mongoose.connect(process.env.DB_URL)
        .then((data)=>{
            console.log(`Established Connection with ${data.connection.host}`);
        });
        
    } catch (error) {
        console.log(`Connection Error:`,error.message);
        
    }
}