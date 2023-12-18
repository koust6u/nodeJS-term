// Express 모듈을 가져옴
const express = require("express");

// 미들웨어 및 컨트롤러 함수들 가져옴
const { isLoggedIn } = require("../middlewares");
const { loadBalance } = require("../controllers/account");
const {
  bookReg,
  deleteBook,
  updateBook,
  purchaseBook,
} = require("../controllers/book");

// Express의 라우터 생성
const router = express.Router();

// '/register' 엔드포인트에 대한 POST 요청 처리. 로그인한 사용자만 허용
// 도서 공유 등록기능 라우팅
router.post("/register", isLoggedIn, bookReg);

// '/delete/:id' 엔드포인트에 대한 POST 요청 처리. 로그인한 사용자만 허용
// 도서 삭제기능 라우팅
router.post("/delete/:id", isLoggedIn, deleteBook);

// '/edit/:id' 엔드포인트에 대한 POST 요청 처리. 로그인한 사용자만 허용
// 도서 정보 수정 라우팅
router.post("/edit/:id", isLoggedIn, updateBook);

// '/purchase/:id' 엔드포인트에 대한 POST 요청 처리. 로그인한 사용자만 허용
// 도서 대여 기능 라우팅
router.post("/purchase/:id", isLoggedIn, purchaseBook);

// 라우터 모듈을 외부로 내보냄
module.exports = router;
