const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signupSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    },
    cpassword :{
        type : String,
        required : true
    },
    tokens : [{
        token : {
        type : String,
        required : true
        }
    }]
})

signupSchema.methods.generateJWT = async function() {
    try {
        const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY) 
        this.tokens = this.tokens.concat({token})
        await this.save()
        return token
    } catch (err) {
        console.log(err);
    }
}


signupSchema.pre("save", async function(next){
    
    if (this.isModified("password")){
        console.log(`before :  ${this.password}`);
        this.password = await bcrypt.hash(this.password,10)
        console.log(`After :  ${this.password}`);
        this.cpassword = await bcrypt.hash(this.cpassword,10)
        }
    next()
})
const Details = new mongoose.model("detail",  signupSchema)
module.exports = Details