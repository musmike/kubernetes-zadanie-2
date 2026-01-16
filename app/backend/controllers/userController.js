const { User, validateProfileChangeData, validatePasswordChangeData } = require("../models/userModel")
const bcrypt = require("bcryptjs")

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).send({ message: "Nieznaleziono użytkownika!" });
        }

        res.status(200).send({ message: "Konto usunięte pomyślnie" });
    } 
    catch (error) {
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};

const updateUser = async (req, res) => {
    try {
        let updateFields = {};
        let passwordFields = {};

        const isUpdatingPassword = req.body.currentPassword || req.body.newPassword || req.body.confirmNewPassword;
        const isUpdatingProfile = req.body.firstName || req.body.lastName || req.body.email;

        if (isUpdatingPassword) {

            const { error: passwordError } = validatePasswordChangeData(req.body);
            if (passwordError) {
                return res.status(400).send({ message: passwordError.details[0].message });
            }

            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).send({ message: "Nie znaleziono użytkownika." });
            }

            const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).send({ message: "Aktualne hasło jest niepoprawne." });
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
            passwordFields.password = hashPassword;
        }

        if (isUpdatingProfile) {
            if (req.body.firstName) updateFields.firstName = req.body.firstName;
            if (req.body.lastName) updateFields.lastName = req.body.lastName;
            if (req.body.email) updateFields.email = req.body.email;

            const { error: profileDataError } = validateProfileChangeData(updateFields);
            if (profileDataError) {
                return res.status(400).send({ message: profileDataError.details[0].message });
            }

            const user = await User.findOne({ email: req.body.email });

            if (user) {
                return res.status(409)
                    .send({ message: "Użytkownik o podanym adresie email istnieje!" });
            }
        }

        if (!isUpdatingPassword && !isUpdatingProfile) {
            return res.status(400).send({ message: "Brak danych do aktualizacji." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { ...updateFields, ...passwordFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "Nie znaleziono użytkownika." });
        }

        res.status(200).send({ message: "Dane użytkownika zaktualizowane pomyślnie." });
    } 
    catch (error) {
        res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
    }
};

module.exports = { deleteUser, updateUser };