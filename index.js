var Express = require("express");
var MongoClient = require("mongodb").MongoClient; // Note the .MongoClient
var cors = require("cors");
const multer = require("multer");
var app = Express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://rmidhela:TkWypdnN1hWjKKP4@cluster0.ispb2yc.mongodb.net/";

var DATABASE = "users";
var database;

app.listen(5038, () =>{
    MongoClient.connect(CONNECTION_STRING, (error, client) => {
        if (error) {
            console.error("An error occurred connecting to MongoDB: ", error);
            return;
        }

        database = client.db(DATABASE);
        console.log("MongoDB Connected");
    });
})


app.get()