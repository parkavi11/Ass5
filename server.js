/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Parkavi Kishokanth Student ID: 150994218 Date: 25 July 2022
*
*  Online (Heroku) Link: https://parkavi-web700-ass5.herokuapp.com
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const data = require("./modules/collegeData.js");
var exphbs = require('express-handlebars')
var multer = require('multer')
var upload = multer();

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item " ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    ,
    
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 2 ){
            throw new Error("Handlebars Helper equal needs 2 parameters");
        }
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
}
}));

app.get("/", (req,res) => {
    // res.sendFile(path.join(__dirname, "/views/home.html"));
    res.render('home')
});

app.get("/home", (req,res) => {
    // res.sendFile(path.join(__dirname, "/views/about.html"));
    res.render('home', {
        layout: "main"
    })
});

app.get("/about", (req,res) => {
    // res.sendFile(path.join(__dirname, "/views/about.html"));
    res.render('about', {
        layout: "main"
    })
});

app.get("/htmlDemo", (req,res) => {
    // res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
    res.render('htmlDemo', {
        layout: "main"
    })
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course).then((course) => {
            // res.json(data);
            res.render("students", {
                data: course,
                layout: "main"
            })
        }).catch((err) => {
            // res.json({ message: "no results" });
            err = {
                message: "no results"
            }
            res.render("students", {
                message: "no data found"
            })
            
        });
    } else {
        data.getAllStudents().then((students) => {
            // res.json(data);
            res.render("students", {
                data: students,
                layout: "main"
            })
        }).catch((err) => {
            // res.json({ message: "no results" });
            err = {
                message: "no data"
            }
            res.render("students", {
                message: "no data"
            })
        });
    }

    res.render("students", { data })
});

app.get("/students/add", (req,res) => {
    // res.sendFile(path.join(__dirname, "/views/addStudent.html"));
    res.render('addStudent', { 
        layout: "main"
    } )
});


app.post("/students/add", (req, res) => {
    data.addStudent(req.body).then(()=>{
      res.redirect("/students");
    });
});

app.get("/student/:studentNum", (req, res) => {
    data.getStudentByNum(req.params.studentNum).then((student) => {
        // res.json(data);
        res.render("students", {
            data: student,
            layout: "main"
        })
    }).catch((err) => {
        // res.json({message:"no results"});
        res.render("student", {
            message: "cannot find data"
        })
    });
});

app.get("/course/:courseId", (req, res) => {
    data.getStudentByNum(req.params.courseId).then((course) => {
        // res.json(data);
        res.render("courses", {
            data: course,
            layout: "main"
        })
    }).catch((err) => {
        // res.json({message:"no results"});
        res.render(course, {
            message: "cannot find courses"
        })
    });
});

app.get("/tas", (req,res) => {
    data.getTAs().then((data)=>{
        res.json(data);
    });
});

app.get("/courses", (req,res) => {
    data.getCourses().then((courses)=>{
        // res.json(data);
        res.render("courses", {
            data: courses,
            layout: "main"
        })
    }).catch(err => {
        res.render("courses", {
            message: "no results"
        })
    })
});

app.post("/student/update", (req, res) => {
    res.redirect("/students");

    console.log(JSON.stringify(req.body))
    collegedata.updateStudent(req.body).then(()=>{
        
        res.redirect("/students")
    }).catch(err=>{
        res.send(err)
    })
});

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});


data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});
