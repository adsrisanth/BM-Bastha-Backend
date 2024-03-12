const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({code:-1 , message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.payload = decoded;

    next();
  } catch (error) {
    return res.status(403).json({code:-1 , message: "Invalid token." });
  }
};

module.exports = verifyToken