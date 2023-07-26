const { validationResult } = require("express-validator");

const validateRegisterResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    let data=err.mapped();
    res.status(203).json({ data: data, flag: false });
  }
};

module.exports = { validateRegisterResult };
