const jwt = require("jsonwebtoken");

function authenticate_Token(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(500).json({ error: "Null token" });
  }
  jwt.verify(token, "hbkhbkhdsfvwjhfvwhejvf78wyrfbwi8f", (error, user) => {
    if (error) return res.status(401).json({ error: error.message });
    next();
  });
}

module.exports = { authenticate_Token };
