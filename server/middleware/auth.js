const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: verify JWT Bearer token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Bearer token missing.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'pulsehr_secret_jwt_2026'
    );
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

// Grant access to specific roles: e.g. authorize('admin', 'hr')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to execute this action. Required: [${roles.join(', ')}]`
      });
    }
    next();
  };
};

// Hierarchical Role Permission Level
const ROLE_HIERARCHY = {
  admin: 4,
  hr: 3,
  manager: 2,
  employee: 1
};

exports.checkHierarchy = (minRole) => {
  return (req, res, next) => {
    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 1;

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Insufficient privileges. Minimum role required: ${minRole.toUpperCase()}`
      });
    }
    next();
  };
};
