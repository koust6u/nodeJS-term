// Express 모듈을 가져옴
const express = require("express");

// 미들웨어 및 컨트롤러 함수 가져옴
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { renderProfile } = require("../controllers/page");
const { updateProfile } = require("../controllers/user");

// Express의 라우터 생성
const router = express.Router();

// '/edit' 엔드포인트에 대한 POST 요청 처리
// 사용자 프로필 수정 요청 라우팅
router.post("/edit", isLoggedIn, updateProfile);

// 라우터 모듈을 외부로 내보냄
module.exports = router;
