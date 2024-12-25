const app = require("./app");
const env = require("dotenv");
const { dataBaseConnection } = require("./src/config/databaseConnection");

env.config();
dataBaseConnection();


app.use((err,req,res,next)=>{
  if(err){

    console.error(err.message);
    

    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server Running`);
});
