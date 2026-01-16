const { Review, validateReviewData } = require('../models/reviewModel');

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('author', 'firstName lastName')
            .sort({ updated_at: -1 }); 
        res.json(reviews);
    }
    catch (error) {
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};

const getReviewById = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const review = await Review.findById(reviewId).populate('author', 'firstName lastName'); 

        if (!review) {
            return res.status(404).send({ message: "Nie znaleziono opinii." });
        }

        res.json(review);
    } 
    catch (error) {
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};

const createReview = async (req, res) => {
    const { content } = req.body;
    const author = req.user._id;

    try {
        const newReview = new Review({
            author,
            content,
        });

        const savedReview = await newReview.save();

        res.status(201).send({ message: "Pomyślnie utworzono opinię." });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};


const updateReview = async (req, res) => {
    const { content } = req.body;
    const reviewId = req.params.id;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).send({ message: 'Opinia nie została znaleziona!' });
        }

        review.content = content;
        review.updated_at = Date.now();

        const updatedReview = await review.save();
        res.json(updatedReview);
    }
    catch (error) {
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};

const deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).send({ message: 'Opinia nie została znaleziona!' });
        }
        res.json({ message: 'Usunięto opinię.' });
    }
    catch (error) {
        res.status(500).send({ message: "(E) Błąd wewnętrzny serwera!" });
    }
};

module.exports = { 
    getAllReviews, 
    getReviewById, 
    createReview,
    updateReview, 
    deleteReview 
};