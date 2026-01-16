const mongoose = require('mongoose');
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
    author: {    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    content: { type: String, required: true, maxlength: 500 }, 
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

const validateReviewData = (data) => {

    const schema = Joi.object({
        content: Joi.string().required().max(500).messages({
            'any.required': 'Treść recenzji jest wymagana!',
            'string.empty': 'Treść recenzji nie może być pusta!',
            'string.max': 'Treść recenzji może mieć maksymalnie {#limit} znaków!'
        })
    });

    return schema.validate(data);
};

module.exports = { Review, validateReviewData };
