const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");
const flash = require("connect-flash");
const authRoutes = require("./routes/auth");
const path = require("path");
const dotenv = require("dotenv");
const pageRouter = require("./routes/page");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const accountRoutes = require("./routes/account");
const bodyParser = require("body-parser");
const passportConfig = require("./passport");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("port", process.env.PORT || 8321);
app.set("view engine", "html");
app.use(cookieParser());

nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret_key",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
require(path.join(__dirname, "passport"))(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/myAccount", accountRoutes);
app.use("/book", bookRoutes);

app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  err.status = 404;
  next(err);
});

const PORT = process.env.PORT || 8321;
app.listen(PORT, () => {
  console.log(`${app.get("port")}번 포트에서 대기 중`);
});
