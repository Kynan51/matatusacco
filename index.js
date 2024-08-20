const express = require("express")

const app = express()
app.use(express.static("public"))
app.get("/", (req,res)=>{
    // home page/route/path
    res.render("home.ejs");
});
app.get("/Vehicles", (req,res)=>{
    // all vehicles route
    res.render("vehicles.ejs");
});

// start your application - using a network port
app.listen(3003)