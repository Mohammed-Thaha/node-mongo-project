const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose"); // Assuming this is your MongoDB connection

const collection = require("./mongodb");

// Load environment variables
require('dotenv').config();

// Set template path and static files directory
const templatepath = path.join(__dirname, "../templates");
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", templatepath);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB connection using environment variables
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(() => {
        console.log("Failed to connect to MongoDB");
    });

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };
    console.log(data);
    await collection.insertMany([data]);

    res.render("home");
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name });
        console.log(check);
        if (check && check.password === req.body.password) {
            return res.render("home");
        } else {
            return res.send("Wrong password");
        }
    } catch (error) {
        return res.send("Wrong details");
    }
});

// Start the server using environment variable for port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

