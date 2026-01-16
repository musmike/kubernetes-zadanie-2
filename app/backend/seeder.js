const fs = require('fs');
const path = require('path');
const { User } = require('./models/userModel');
const Post = require('./models/postModel');
const { Review } = require('./models/reviewModel');

const transformData = (data) => {
    return data.map(item => {
        const newItem = { ...item };
        
        if (newItem._id && newItem._id.$oid) {
            newItem._id = newItem._id.$oid;
        }
        
        if (newItem.created_at && newItem.created_at.$date) {
            newItem.created_at = newItem.created_at.$date;
        }
        if (newItem.updated_at && newItem.updated_at.$date) {
            newItem.updated_at = newItem.updated_at.$date;
        }

        if (newItem.author && newItem.author.$oid) {
            newItem.author = newItem.author.$oid;
        }

        return newItem;
    });
};

const importCollection = async (Model, data, name) => {
    let addedCount = 0;
    
    for (const item of data) {
        try {
            const exists = await Model.findById(item._id);
            
            if (!exists) {
                if (name === 'Użytkownicy' && item.email) {
                    const emailExists = await Model.findOne({ email: item.email });
                    if (emailExists) {
                        console.log(`⚠️ Pominięto użytkownika (email zajęty): ${item.email}`);
                        continue;
                    }
                }

                await Model.create(item);
                addedCount++;
            }
        } catch (err) {
            console.error(`❌ Błąd przy dodawaniu elementu do ${name}:`, err.message);
        }
    }

    if (addedCount > 0) {
        console.log(`✅ ${name}: dodano ${addedCount} nowych wpisów.`);
    } else {
        console.log(`ℹ️ ${name}: wszystkie wpisy z pliku JSON już istnieją.`);
    }
};

const seedDatabase = async () => {
    try {
        console.log('📦 Rozpoczynam weryfikację i seedowanie danych...');

        const dataPath = path.join(__dirname, 'init_data');

        const usersRaw = fs.readFileSync(path.join(dataPath, 'users.json'), 'utf-8');
        const postsRaw = fs.readFileSync(path.join(dataPath, 'posts.json'), 'utf-8');
        const reviewsRaw = fs.readFileSync(path.join(dataPath, 'reviews.json'), 'utf-8');

        const users = transformData(JSON.parse(usersRaw));
        const posts = transformData(JSON.parse(postsRaw));
        const reviews = transformData(JSON.parse(reviewsRaw));

        await importCollection(User, users, 'Użytkownicy');
        await importCollection(Post, posts, 'Posty');
        await importCollection(Review, reviews, 'Opinie');

        console.log('🚀 Proces seedowania zakończony.');

    } catch (error) {
        console.error('❌ Błąd krytyczny seedera:', error);
    }
};

module.exports = seedDatabase;