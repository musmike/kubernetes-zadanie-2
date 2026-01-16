const { User, validateRegisterData, validateLoginData } = require("../models/userModel");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const { error } = validateRegisterData(req.body);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(409)
                .send({ message: "Użytkownik o podanym adresie email istnieje!" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "Pomyślnie utworzono użytkownika" })
    }
    catch (error) {
        console.error("Błąd rejestracji:", error);
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};

const login = async (req, res) => {
    try {
        const { error } = validateLoginData(req.body);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).send({ message: "Nieprawidłowy adres email!" });
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).send({ message: "Nieprawiłowe hasło!" });
        }

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Zalogowano pomyślnie." });
    }
    catch (error) {
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};

module.exports = { register, login };

