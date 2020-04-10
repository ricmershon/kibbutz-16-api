/*
 ===============================================================================
 ===============================================================================
 =
 = Final project: Kibbutz-19 API
 = Module: server.js
 = Created: 07-Mar-2020
 = Created by: Ric Mershon
 =
 = Description: Entry point for the Kibbutz-19 API. Defines all
 = the dependencies, configuration, middleware, database operations and
 = controllers needed for the app to run. Defines the root route and sets
 = up the listener for the html port.
 =
 ===============================================================================
 ===============================================================================
 */

/*
 ===============================================================================
 = DEPENDENCIES
 ===============================================================================
 */

const express = require("express");
const expressGraphQL = require("express-graphql")
const cors = require('cors')
const session = require("express-session");
const mongoose = require ('mongoose')
const schema = require("./models/schema")

/*
 ===============================================================================
 = CONFIGURATION
 ===============================================================================
 */

require("dotenv").config();
const app = express()
const db = mongoose.connection
const PORT = process.env.PORT || 3000; // Allows use of Heroku's or local port.
const mongodbURI = process.env.MONGODB_URI;

/*
 ===============================================================================
 = MIDDLEWARE
 ===============================================================================
 */

app.use(cors())
app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));      // Public folder for static assets.
app.use(express.json());                // Parses JSON.

app.use(
    session({
        secret: process.env.SECRET,     // Radom string to prevent hacking
        resave: false,                  // Default
        saveUninitialized: false
    })
)

/*
 ===============================================================================
 = DATABASE
 ===============================================================================
 */

mongoose.connect(
  mongodbURI,
  {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true,
     useFindAndModify: false
  }, () => { console.log("MongoDB connected:", mongodbURI) }
)

//
// Callbacks for error or disconnected states on database.
//

db.on("error", (err) => console.log("Mongod is not running.", err));
// db.on("connected", () => console.log("Mongo connected: ", mongodbURI));
db.on("disconnected", () => console.log("Mongod disconnected."));
db.on("open" , () => {});

/*
 ===============================================================================
 = Listener
 ===============================================================================
 */

app.listen(PORT, () => console.log("Server is istening on port", PORT));
