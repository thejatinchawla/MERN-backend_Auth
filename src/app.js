require('dotenv').config()
const express = require("express")
const app = express()
const port = process.env.PORT || 8000
const hbs = require("hbs")
const path = require("path")
require("./db/conn")
const Details = require("./models/details")
const bcrypt = require("bcrypt")

const staticPath = path.join(__dirname,"../public")
app.use(express.static(staticPath))

const viewPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname,"../templates/partials")
app.set("view engine", "hbs")
app.set("views", viewPath)
hbs.registerPartials(partialsPath)
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    res.render("main")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.get("/login",(req,res)=>{
    res.render("login")
}) 

app.post("/signup", async (req,res)=>{
    try {
        password = req.body.password
        cpassword = req.body.cpassword

        if (password === cpassword){

            const dataSave = new Details({
                fullname : req.body.fullname,
                email : req.body.email,
                password ,
                cpassword
            })

            const token = await dataSave.generateJWT()
            console.log(`Signup token : ${token}`);

            const datasaved = await dataSave.save()
            console.log(datasaved);
            res.status(201).render("login")
        }
        else{
            res.send("passwords are not matching")
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

app.post("/login", async(req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password 
        
        const userDetail = await Details.findOne({email:email})  //email:email  js destructuring feature
        
        const passwordMatch = await bcrypt.compare(password,userDetail.password)
        const token = await userDetail.generateJWT()
            console.log(`login token : ${token}`)
        
        if (passwordMatch){
            res.status(201).render("main")
        }
        else{
            res.send("incorrect password")
        }
    } catch (error) {
        res.status(400).send("invalid details fuck off and an error occured")
        console.log(`error : ${error}`);
    }
})

app.listen(port,()=>{
    console.log(`Server is listening at http://localhost:${port}`);
})
