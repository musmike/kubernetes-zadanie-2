const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        enum: ['user', 'admin'],
        default: 'user'
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { 
            _id: this._id, 
            status: this.status, 
            name: this.firstName + " " + this.lastName 
        }, 
        process.env.JWTPRIVATEKEY, 
        {
            expiresIn: "7d",
        }
    );
    return token;
}

const User = mongoose.model("User", userSchema);

const validateRegisterData = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(30).required().messages({
            'any.required': 'Pole Imię jest wymagane!',
            'string.empty': 'Pole Imię nie może być puste!',
            'string.min': 'Imię powinno mieć co najmniej {#limit} znaki!',
            'string.max': 'Imię powinno mieć maksymalnie {#limit} znaków!'
        }),
        lastName: Joi.string().min(2).max(30).required().messages({
            'any.required': 'Pole Nazwisko jest wymagane!',
            'string.empty': 'Pole Nazwisko nie może być puste!',
            'string.min': 'Nazwisko powinno mieć co najmniej {#limit} znaki!',
            'string.max': 'Nazwisko powinno mieć maksymalnie {#limit} znaków!'
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Pole Email jest wymagane!',
            'string.empty': 'Pole Email nie może być puste!',
            'string.email': 'Podaj adres email w poprawnej formie!'
        }),
        password: passwordComplexity().required().messages({
            'any.required': 'Pole Hasło jest wymagane!',
            'string.empty': 'Pole Hasło nie może być puste!'
        }),
    });

    return schema.validate(data);
};

const validateLoginData = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'any.required': 'Pole Email jest wymagane!',
            'string.empty': 'Pole Email nie może być puste!',
            'string.email': 'Podaj adres email w poprawnej formie!'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Pole Hasło jest wymagane!',
            'string.empty': 'Pole Hasło nie może być puste!'
        }),
    });

    return schema.validate(data);
};

const validateProfileChangeData = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(30).allow('').label("Imię").messages({
            'string.min': 'Pole Imię powinno mieć co najmniej {#limit} znaki!',
            'string.max': 'Pole Imię powinno mieć maksymalnie {#limit} znaków!'
        }),
        lastName: Joi.string().min(2).max(30).allow('').label("Nazwisko").messages({
            'string.min': 'Pole Nazwisko powinno mieć co najmniej {#limit} znaki!',
            'string.max': 'Pole Nazwisko powinno mieć maksymalnie {#limit} znaków!'
        }),
        email: Joi.string().email().allow('').label("Email").messages({
            'string.email': 'Podaj adres email w poprawnej formie!'
        }),
    });

    return schema.validate(data);
};


const validatePasswordChangeData = (data) => {
    const schema = Joi.object({
        currentPassword: Joi.string().required().label("Aktualne hasło").messages({
            'any.required': "Pole 'Aktualne hasło' jest wymagane!",
            'string.empty': "Pole 'Aktualne hasło' nie może być puste!"
        }),
        newPassword: passwordComplexity().required().label("Nowe hasło").custom((value, helpers) => {
            if (value === helpers.state.ancestors[0].currentPassword) {
                return helpers.message("Nowe hasło nie może być identyczne z aktualnym hasłem!");
            }
            return value;
        }).messages({
            'any.required': "Pole 'Nowe hasło' jest wymagane!",
            'string.empty': "Pole 'Nowe hasło' nie może być puste!"
        }),
        confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required().label("Potwierdzenie nowego hasła").messages({
            "any.only": "Pola z nowym hasłem muszą być identyczne!",
            'any.required': "Pole 'Potwierdź nowe hasło' jest wymagane!",
            'string.empty': "Pole 'Potwierdź nowe hasło' nie może być puste!"
        }),
    });

    return schema.validate(data);
};

module.exports = { User, validateRegisterData, validateLoginData, validateProfileChangeData, validatePasswordChangeData };

