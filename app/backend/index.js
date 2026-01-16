require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connection = require('./db')
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const seedDatabase = require('./seeder')

const app = express()

app.use(express.json())
app.use(cors({
    origin: '*'
}));

app.use("/auth", authRoutes);
app.use("/api", userRoutes);

connection()

seedDatabase()

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Nasłuchiwanie na porcie ${port}`);
});


