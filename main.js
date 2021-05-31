// TODO :: Joi auth/ url encode/ Any other Auth needed.
// Modules
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { db_connection } = require('./db_config');
const { exit } = require('process');

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(fileUpload())

app.get("/", (req, res) => {
    res.sendStatus(200).send("<p>Connection active</p>");
});

// returns upload form view
app.get("/add/", (req, res) => {
    
});

// Create data and Save into DB
app.post("/create/", (req, res) => {
    let uploadFolder = "";
    let images = new Array();
    
    // check if request is not empty
    let uploads = (req.files.upload) ? (req.files.upload) : [];
    if (uploads.length >1) {
        uploads.forEach(image => { 
            // save filenames in array for database column
            images.push(image.name);
        });
    } else {
        images.push(uploads.name);
    }
    // console.log(images);
    // console.log(uploads);
    
    
    // Create folder if not present
    if (!fs.existsSync('./uploads'))        
        uploadFolder = fs.mkdirSync('./uploads/');    
    uploadFolder = path.join(__dirname,'./uploads/');

    // save files into uploads folder
    if (uploads.length > 1) {
        uploads.forEach(image => {        
            console.log(image);
            console.log(image.name);
            image.mv(uploadFolder + image.name, (err) => {
                if (err){
                    throw err;
                } else {
                    console.log("File Saved in Folder");                    
                }
                
            });
        });
    } else {
        uploads.mv(uploadFolder + uploads.name, (err) => {
            if (err){
                console.trace(err);
            } else {
                console.log("File Saved in Folder");                
            }
        });
    }    
    
    // Post to db
    // let postData = ;
    let sql = `INSERT INTO details SET ?;`;
    
    db_connection.query(sql, {
        title: req.body.title.toString(),
        description: req.body.description.toString(),
        images: images.join(",").toString()
    }, (error, result) => {
            if (error){
                console.trace(error);
        }
            console.log("Result: " + result.insertId);
            
        });
    res.send(`Uploaded`).end();
});


// Read data
app.get("/item/:id", (req, res) => {

});


// update/edit data
app.put("/edit/:id", (req, res) => {
    
});

// delete data
app.post("/delete/:id", (req, res) => {
    if (req.params.id !== null || "") {
        let sql = "DELETE FROM details WHERE ? ;";
        db_connection.query(sql, { id: req.params.id }, (error, result) => {
            if (error)
                throw error.sqlMessage;            
            console.log("item deleted" + result.affectedRows);
            res.send(`<p>Item deleted: ${result.affectedRows} </p>`).end();
        });
    } else {
        res.sendStatus(404).send(`<p>Item not found</p>`).end();
    }
});

app.listen("3000", () => {
    console.log("Server is running.");
});