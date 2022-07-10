const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/factgram")
.then(()=>{
    console.log(`DB connection successful`);
}).catch((e)=>{
    console.log(e);
})