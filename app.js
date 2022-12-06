const express = require('express');
const path = require('path');
const api = express();
const hbs = require('hbs');
require("./src/db/conn");
const registers = require("./src/models/registers");
const { resourceLimits } = require('worker_threads');
const bcrypt = require('bcrypt')
const port = process.env.PORT || 8080;
const static_path = path.join(__dirname,"./public");
const template_path = path.join(__dirname,"./src/templates/views");
const partials_path = path.join(__dirname,"./src/templates/partials");
//postman
api.use(express.json());
api.use(express.urlencoded({extended:false}));

//this can be used for html files
api.use(express.static(static_path))
// this can be used for hbs files (which renders hbs files)
api.set("view engine", "hbs");
api.set("views",template_path);
hbs.registerPartials(partials_path);


api.get('/',(req,res)=>{
    res.render("index")
});
api.get("/register",(req,res)=>{
    res.render("register");
});
// to create user database
api.post("/register",async(req,res)=>{
    try {
       const password= req.body.password;
       const rpassword = req.body.repeatpassword;
       const salt = await bcrypt.genSalt(10)
        const  hashedpassword = await bcrypt.hash(password,salt)
       if(password === rpassword){
        
        const savedbookingschema = await registers.create
           ({

                    name : req.body.name,
                    email : req.body.email,
                    password :hashedpassword
                
           })
           await savedbookingschema.save()
           // to save in database
           res.send('success')
        // res.status(514).render("index");
       }else{
           res.send("passwords are not matching");
       }

        
    } catch (error) {
        console.log(error)
        res.status(555).send(error);
    }
});
api.get("/login",(req,res)=>{
    res.render("login");
});
//login check
api.post("/login",async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.psw;

       const userEmail= await  registers.findOne({email : email});

        if(userEmail.password === password)
        {
            res.status(514).render("index");
        }else{
           res.send("invalid login details");

        }
        
    } catch (error) {
        res.status(555).send("invalid email or password");
        
    }
});
api.listen(port,()=>{
    console.log(`server is running at port number ${port}`);
})
