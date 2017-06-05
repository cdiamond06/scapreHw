/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var methodOverride = require("method-override");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

var count = 0;



// Make public a static dir
app.use(express.static("./public"));
// view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/scraperhw");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// var routes = require("./controllers/controller.js");

// app.use("/", routes);

app.get('/', function(req, res){
 Article.remove({}, function(err) { 
   console.log('collection removed') 
});
  res.redirect("/home");
});

app.get("/home", function(req, res){
  if(count = 0) {
     res.render("home");
   } else{
      // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
  })
  .then(function(data){
    // console.log("---------------",typeof doc);
    var topstories = [];
    for(var i = 0; i < 15; i++){
      topstories.push(data[i]);
    }
    res.render("home", topstories);
  });
   }
});

app.get("/savedarticle", function(req, res){
  if(count = 0) {
     res.render("home");
   } else{
      // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
  })
  .then(function(data){
    // console.log("---------------",typeof doc);
    var topstories = [];
    for(var i = 0; i < 15; i++){
      topstories.push(data[i]);
    }
    res.render("saved", topstories);
  });
   }
});

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.latimes.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("section h3").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  count++;
  res.redirect("/home");
});

// This will get the articles we scraped from the mongoDB
// app.get("/articles", function(req, res) {
//   // Grab every doc in the Articles array
//   Article.find({}, function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Or send the doc to the browser as a json object
//     else {
//       console.log("This is the type of doc line 126", typeof doc)
//       // res.json(doc);
//       console.log("this is line 28", doc);
      
//     }
//   })
//   .then(function(data){
//     // console.log("---------------",typeof doc);
//     res.render("home", data)
//   });
// });

// // Grab an article by it's ObjectId
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   Article.findOne({ "_id": req.params.id })
//   // ..and populate all of the notes associated with it
//   .populate("note")
//   // now, execute our query
//   .exec(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the doc to the browser as a json object
//     else {
//       res.json(doc);
//     }
//   });
// });


// Create a new note or replace an existing note
app.post("/saved/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry

  // And save the new note the db

      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.render("home");
        }
      });

});

app.post("/delete/:id", function(req, res) {

      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.render("saved");
        }
      });

});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});