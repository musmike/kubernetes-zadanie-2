const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    short_description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image_link: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;