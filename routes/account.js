// Express 모듈 및 Passport 모듈을 가져옴
const express = require("express");
const passport = require("passport");

// 미들웨어 가져옴
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

// 컨트롤러 함수 가져옴
const { loadBalance } = require("../controllers/account");

// Express의 라우터 생성
const router = express.Router();

// '/charge' 엔드포인트에 대한 PATCH 요청 처리. 로그인한 사용자만 허용
// 계좌에 포인트 충전하는 route
router.patch("/charge", isLoggedIn, loadBalance);

// 라우터 모듈을 외부로 내보냄
module.exports = router;
