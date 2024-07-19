// middleware/roleBasedAuth.js
const rolesAllowed = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.userDetails.role)) {
      next();
    } else {
      return res.status(403).json({
        status: "Access Denied",
        message: "Your role cannot access this route",
      });
    }
  };
};

module.exports = rolesAllowed;
