require('dotenv').config();
const mongoose = require('mongoose');
const seedDatabase = require('./seeder');

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Connected to database for seeding.");

        await seedDatabase();
        
        console.log("Seeding completed successfully.");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

runSeeder();