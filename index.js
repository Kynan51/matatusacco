const express = require("express"); // import express from express -- es6 (2015)

const mysql = require("mysql")

const dbconnection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "matatu"
})

const app = express();

app.use(express.static("public")); // middleware --- app.use(func) - func will executed on every request
app.use(express.urlencoded({extended: true})) // express urlencoded
app.use((req,res, next)=>{
  console.log("Middleware Function") // authorization -- block some route 
  next() 
})

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
        dbconnection.query(`SELECT * FROM vehicles JOIN drivers ON vehicles.NumberPlate = drivers.AssignedVehicle WHERE NumberPlate = "${req.query.plate}"`, (sqlErr, vehicle)=>{
            if(sqlErr){
                res.status(500).send("Server Error!!")
            }else{
                console.log(vehicle);
                if(vehicle.length > 0){
                    // get trips for this vehicle
                    dbconnection.query(`SELECT * FROM trips JOIN routes ON trips.Route = routes.route_id WHERE Vehicle = "${req.query.plate}"`, (error, trips)=>{
                        if(error){
                          res.status(500).send("Server Error!!")
                        }else{              
                          res.render("vehicle.ejs", {vehicle: vehicle[0], trips: trips})
                        }
                      })  
                    res.render("vehicle.ejs", {vehicle: vehicle[0]})
                }else{
                    res.render("vehicle.ejs", {message: "No vehicle found / invalid vehicle plate"})
                }
               
            }
        })
    }
})



app.get("/newtrip", (req,res)=>{
    if(!req.query.plate){
      res.render("newtrip.ejs", {message: "No vehicle selected"})
    }else{
      dbconnection.query("SELECT * FROM routes", (err, routes)=>{
        if(err){
          res.status(500).send("Server Error!!")
        }else{
          res.render("newtrip.ejs", {numberPlate: req.query.plate, routes: routes })
        }
      })
    }
  })
  app.post("/newtrip", (req,res)=>{
    //
  })
  
  app.post("/newtrip", (req,res)=>{

  console.log( req.body ); /// data in the form
  const {numberPlate, route, departure}= req.body
  dbconnection.query(`INSERT INTO trips(Route,Vehicle,Departure,TripStatus) VALUE(${route},"${numberPlate}", "${departure.replace("T", " ") + ":00" }","Scheduled")`, (sqlErr)=>{
    if(sqlErr){
      res.status(500).render("500.ejs")
    }else{
      res.redirect(`/vehicle?plate=${numberPlate}`)
    }
  } )
})

app.get("/updatetrip", (req,res)=>{
  dbconnection.query(`UPDATE trips SET TripStatus = "${req.query.value}" WHERE trip_id = ${req.query.trip}`, (sqrErr)=>{
    if(sqrErr){
      res.status(500).render("500.ejs")
    }else{
      res.redirect(`/vehicle?plate=${req.query.plate}`)
    }
  })
})

app.post("/newtrip", (req,res)=>{

  console.log( req.body ); /// data in the form
  const {numberPlate, route, departure}= req.body
  dbconnection.query(`INSERT INTO trips(Route,Vehicle,Departure,TripStatus) VALUE(${route},"${numberPlate}", "${departure.replace("T", " ") + ":00" }","Scheduled")`, (sqlErr)=>{
    if(sqlErr){
      res.status(500).render("500.ejs")
    }else{
      res.redirect(`/vehicle?plate=${numberPlate}`)
    }
  } )
})

app.get("/updatetrip", (req,res)=>{
  dbconnection.query(`UPDATE trips SET TripStatus = "${req.query.value}" WHERE trip_id = ${req.query.trip}`, (sqrErr)=>{
    if(sqrErr){
      res.status(500).render("500.ejs")
    }else{
      res.redirect(`/vehicle?plate=${req.query.plate}`)
    }
  })
})

app.get("/owner", (req,res)=>{
    // individual owner route
    if(!req.query.id){
        res.render("owner.ejs", {message: "No owner selected"})
    }else{
        dbconnection.query(`SELECT * FROM owners JOIN vehicles on owners.ID_NO = vehicles.OwnerID WHERE ID_NO = "${req.query.id}"`, (sqlErr, ownerData)=>{
            if(sqlErr){
                res.status(500).send("Server Error!!")
            }else{
                if(ownerData.length > 0){
                    res.render("owner.ejs", {ownerData})
                }else{
                    res.render("owner.ejs", {message: "No owner found (wrong id provided)"})
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