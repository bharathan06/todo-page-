const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/todoTask");

const app = express();
dotenv.config();



//This serves files from the public directory at the /static path.
app.use("/static", express.static("public"));   
app.use(express.urlencoded({ extended: true }));



// Use async/await for proper connection handling
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });
        console.log("Connected to db!");

        // Start the server **only after** database connection is successful
        app.listen(3000, () => console.log("Server Up and running"));
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

// Call the async function
connectDB();


app.set("view engine", "ejs");

//Route handler 
//response = result (backend), req = request(frontend)
// res and req are objects created by express, these objects have many methods within them
// send, sendCode, json, etc. 
app.get('/', async (req,res) => {
    try {
        const tasks = await TodoTask.find({});
        res.render("todo.ejs", { todoTasks: tasks });
    } catch (err) {
        console.error("Error fetching tasks: ", err);
        res.statusCode(500);
    }
});

app.route("/edit/:id")
.get( async (req,res) => {
    try {
        const id = req.params.id;
        const task = await TodoTask.findById(id);
        res.render("todoEdit.ejs", { todoTask: task , idTask : id});
    } catch(err) {
        console.error("Error getting task");
        console.statusCode(500);
    }
})
.post( async (req,res) => {
    try{
        const id = req.params.id;
        await TodoTask.findByIdAndUpdate(id, {content: req.body.content});
        res.redirect("/");
    } catch (err) {
        console.error("Error updating task");
        res.statusCode(500);
    }
});

app.route("/remove/:id")
.get( async (req,res) => {
    try{
        const id = req.params.id;
        await TodoTask.findByIdAndRemove(id);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting task");
        res.statusCode(500);
    }
})

app.post('/', async (req,res) => {
    const todoTask = new TodoTask({
        content : req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    }   catch (err) {
        res.redirect("/");
    }
});






//Parameters for listen fucntion is always port number and a callback function, 
// here the call back function should be reference, not the function call itself
