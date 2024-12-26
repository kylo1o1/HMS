const jwt = require("jsonwebtoken");

const authentication =  (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        success: false,
        messagge: "Login Timed Out",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
      if (error) {
        return res.status(400).json({
          success: false,
          messagge: error.message,
        });
      }

      req.id = decode.id;
      req.role = decode.role;

      next();
    });
  } catch (error) {
    console.log("authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

const authoriazation =  (...authRoles) => {
  
  return (req, res, next) => {
    const { role } = req;


    if (!authRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    next();
  };
};

module.exports = {
  authentication,
  authoriazation
};
