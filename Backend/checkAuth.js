const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        const decoded = jwt.verify(token, "secure12@3");
        req.userData = decoded;
        next();
    } catch(error) {
        res.status(401).json({
            message : "auth failed",
            error : error
        })
    }
}