import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";

// const {
//   TOKENTIME,
//   SECRET
// } = process.env;

const TOKENTIME = 2592000;
const SECRET = "W3_Hav3_th3_kn0w_h0w";

let authenticate = expressJwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {
  req.token = req.token || {};
  req.token = jwt.sign(
    {
      id: req.user.id,
    },
    SECRET,
    {
      expiresIn: TOKENTIME,
    }
  );
  next();
};

let respond = (req, res) => {
  return res.status(200).json({
    user: req.user.username,
    token: req.token,
    id: req.user.id,
    userId: req.user.userId,
    isAdmin: req.user.isAdmin,
    isStaff: req.user.isStaff,
    isSuper: req.user.isSuper,
  });
};

module.exports = {
  authenticate,
  generateAccessToken,
  respond,
};
