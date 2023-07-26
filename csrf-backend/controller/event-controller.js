const { check } = require("express-validator");

const {
  validateRegisterResult,
} = require("../helpers/validate.RegisterUser.Helper");

const eventFormValidator = [
  check("fn").exists().optional(),
  check("bu").exists().optional(),
  check("ph").exists().optional(),
  check("ee").exists().optional(),
  check("ne").exists().optional(),
  (req, res, next) => {
    validateRegisterResult(req, res, next);
  },
];

const createNewParticipant = async (req, res, next) => {
  next();
};

const getNewEventList = async (req, res, next) => {
  let employeesArr = [];
  res.status(200).json({
    eventList: employeesArr,
  });
};

const ok = async (req, res, next) => {
  res.status(200).json({
    flag: true,
  });
};

exports.eventFormValidator = eventFormValidator;
exports.createNewParticipant = createNewParticipant;
exports.getNewEventList = getNewEventList;
exports.ok = ok;
