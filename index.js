const express = require("express");
const mysql = require("mysql")

const dbconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matatu"
})

const app = express()
app.use(express.static("public"))
app.get("/", (req,res)=>{
    // home page/route/path
    res.render("home.ejs");
});
app.get("/Vehicles", (req,res)=>{
    // all vehicles route
    
    dbconnection.query("SELECT * FROM vehicles JOIN owners ON vehicles.OwnerID = owners.ID_NO", (sqlErr, vehicles)=>{
        if(sqlErr){
            res.send("Server Error!!")
        }else{
            // console.log(vehicles);
            res.render("vehicles.ejs", {vehicles})
        }
    })
   
});

app.get("/vehicle",(req,res)=>{
    // individual vehicle route
    console.log(req.query.plate);
    if(!req.query.plate){
        res.render("vehicle.ejs", {message: "No vehicle selected"})
    }else{
        dbconnection.query(`SELECT * FROM vehicles WHERE NumberPlate = "${req.query.plate}"`, (sqlErr, vehicle)=>{
            if(sqlErr){
                res.status(500).send("Server Error!!")
            }else{
                console.log(vehicle);
                if(vehicle.length > 0){
                    res.render("vehicle.ejs", {vehicle: vehicle[0]})
                }else{
                    res.render("vehicle.ejs", {message: "No vehicle found / invalid vehicle plate"})
                }
               
            }
        })
    }
})



// other routes
app.get("*", (req,res) =>{
    // 404 page
    res.status(404).render("404.ejs");
});
// start your application - using a network port
app.listen(3003);