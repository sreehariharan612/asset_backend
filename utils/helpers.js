var jwt = require("jsonwebtoken");

function jwtTokens({ id,name, email, role }) {
  const user = { id,name, email, role };
  const accessToken = jwt.sign(user, "hbkhbkhdsfvwjhfvwhejvf78wyrfbwi8f", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(user, "hwhjdfvwgewvejw7w75b348r4h3iu4f", {
    expiresIn: "1440m",
  });
  return { user, accessToken, refreshToken };
}

function accessToken({ id, name, email, role }) {
  const user = { id,name, email, role };
  const accessToken = jwt.sign(user, "hbkhbkhdsfvwjhfvwhejvf78wyrfbwi8f", {
    expiresIn: "15m",
  });
  return { user, accessToken };
}

module.exports = { accessToken, jwtTokens };
