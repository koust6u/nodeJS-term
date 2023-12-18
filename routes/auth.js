const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout, signup } = require("../controllers/auth");

const router = express.Router();

// POST /auth/join
// 회원가입 라우팅
router.post("/signup", isNotLoggedIn, signup);

// POST /auth/login
// 로그인 기능 라우팅
router.post("/login", isNotLoggedIn, login);

// GET /auth/logout
//로그아웃 기능 라우팅
router.get("/logout", isLoggedIn, logout);

module.exports = router;
