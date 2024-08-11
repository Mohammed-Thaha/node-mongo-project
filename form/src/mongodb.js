const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/login")
.then(()=>{
    console.log("mongo connected");
})
.catch(()=>{
    console.log("failed to connect");
})

const login_schema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    }
)

const collection=new mongoose.model("logincollection",login_schema);

module.exports=collection;