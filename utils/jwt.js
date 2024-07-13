const jwt = require("jsonwebtoken");

// create token
function createToken(data, expiry = "1d") {
  return jwt.sign({ data: data }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
}

function verifyToken(req, res, next) {
  const token = req.cookies?.jwt_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.json(401).json({status:false,msg:"You are not authorized to access"})
        }
        else{
            next();
        }
    });
  }else{
    return res.json(401).json({status:false,msg:"You are not authorized to access"})
  }
}

module.exports = {
  createToken,
  verifyToken
};
