const express = require("express");
const cors = require("cors");
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");
const evnController = require("../controller/event-controller");
const CSRF_SECRET = "super csrf secret";
const COOKIES_SECRET = "super cookie secret";
const CSRF_COOKIE_NAME = "x-csrf-token";

const router = express.Router();
router.use(express.json());

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: false,
  withCredentials: false,
  maxAge: 86400,
  exposedHeaders: "Authorization",
};
const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => CSRF_SECRET,
    cookieName: CSRF_COOKIE_NAME,
    cookieOptions: { sameSite: false, secure: false, signed: false }, // not ideal for production, development only
  });

router.use(cookieParser(COOKIES_SECRET));

const csrfErrorHandler = (error, req, res, next) => {
  if (error == invalidCsrfTokenError) {
    res.status(403).json({
      error: "csrf validation error",
    });
  } else {
    next();
  }
};

router.use(cors(corsOptions));

router.get("/neweventlist", evnController.getNewEventList);

router.get("/csrf-token", (req, res) => {
  return res.json({
    token: generateToken(res, req),
  });
});

router.post(
  "/register",
  doubleCsrfProtection,
  csrfErrorHandler,
  evnController.eventFormValidator,
  evnController.createNewParticipant,
  evnController.ok
);

module.exports = router;
