/*let mongoose=require("mongoose");
function connectToMongoDB(){
    let url="mongodb://localhost:27017/TailorConnect";
    mongoose.connect(url).then(()=>{
        console.log("connected to mongodb")
    }).catch((err)=>{
        console.log(err)
    })
}
module.exports={connectToMongoDB}
*/



const mongoose = require("mongoose");

function connectToMongoDB() {
  mongoose.connect("mongodb+srv://TailorConnect:Kartik.2016@cluster0.kk8pqxt.mongodb.net/TailorConnect?retryWrites=true&w=majority")
    .then(() => {
      console.log("MongoDB Atlas Connected ✅");
    })
    .catch((err) => {
      console.log("MongoDB Connection Error ❌", err);
    });
}

module.exports = { connectToMongoDB };