const { Review } = require('../models/reviewModel');

const checkReviewOwnership = async (req, res, next) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id);

        console.log('Sprawdzanie właściciela opinii. ID opinii:', id);

        if (!review) {
            console.log('Opinia nie została znaleziona.');
            return res.status(404).send({ message: 'Opinia nie została znaleziona!' });
        }

        if (review.author.equals(req.user._id) || req.user.status === 'admin') {
            console.log('Uprawnienia użytkownika zostały potwierdzone.');
            return next();
        }
        else {
            console.log('Brak uprawnień.');
            return res.status(403).send({ message: 'Brak uprawnień!' });
        }
    }
    catch (error) {
        console.log('Błąd wewnętrzny serwera:', error.message);
        return res.status(500).send({ message: 'Błąd wewnętrzny serwera!' });
    }
}

module.exports = { checkReviewOwnership };
