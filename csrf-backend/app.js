const express = require("express");
const HttpError = require("./models/http-error");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const evnRoutes = require("./routes/events-routes");

require("dotenv").config();

const app = express();

//middlewares

app.use(cookieParser(`soyunapalabrasecreta`));
app.use(morgan("combined"));

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: false,
  withCredentials: false,
  maxAge: 86400,
  exposedHeaders: "Authorization",
};

app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: `soyunapalabrasecreta`,
    name: "scd",
    cookie: {
      path: "/",
      sameSite: "strict",
      maxAge: 86400,
      secure: true,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  compression({
    level: 6,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 100 * 1000,
  })
);
app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By");
  next();
});
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.disable("x-powered-by");

app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({ maxAge: 15552000, preload: true }));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter({ "X-XSS-Protection": "1; mode=block" }));

app.use("/api/event", evnRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  console.log("error appuse ", error);
  if (res.headerSent) {
    return next(error);
  }
  let x = error.message || "An unknown error occurred!";
  res.status(error.code || 500).json({ message: x });
});

app.listen(5000);
