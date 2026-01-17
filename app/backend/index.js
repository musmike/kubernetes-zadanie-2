require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const connection = require('./db')
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://brilliantapp.zad',
    credentials: true
}));

app.use("/auth", authRoutes);
app.use("/api", userRoutes);

connection()

const port = process.env.PORT || 5000

app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    
    if (dbState === 1) {
        res.status(200).send("OK - Database Connected");
    } else {
        res.status(500).send("Error - Database Disconnected");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


