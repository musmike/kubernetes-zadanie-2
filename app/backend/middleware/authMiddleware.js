const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    
    if (!token) {
        return res.status(403).send({ message: "Nie dostarczono tokena!" });
    }

    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodeduser) => {
        if (err) {
            console.log("Token niepoprawny, brak autoryzacji!");
            return res.status(401).send({ message: "Token niepoprawny, brak autoryzacji!" });
        }

        console.log("Token poprawny, użytkownik:" + decodeduser._id);
        req.user = decodeduser;
        next();
    })
}

module.exports = { authenticateToken };
