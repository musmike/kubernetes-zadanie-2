const Post = require('../models/postModel');

const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;

    try {
        const posts = await Post.find()
            .sort({ created_at: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);
;
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getPostById = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ message: 'Wpis nie został znaleziony' });
        }

        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPosts, getPostById };