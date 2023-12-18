// Express 모듈을 가져옴
const express = require("express");

// 미들웨어 가져옴
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

// 페이지 컨트롤러 함수들 가져옴
const {
  renderProfile,
  renderLogin,
  renderSignUp,
  renderHome,
  renderMain,
  renderAccount,
  renderBookForm,
  renderBookList,
  renderBookDetails,
  renderChatRoom,
} = require("../controllers/page");

// Express의 라우터 생성
const router = express.Router();

// '/login' 엔드포인트에 대한 GET 요청 처리. 로그인하지 않은 경우에만 렌더링
// 로그인 폼 라우팅
router.get("/login", isNotLoggedIn, renderLogin);

// '/signup' 엔드포인트에 대한 GET 요청 처리
//회원 가능 폼 라우팅
router.get("/signup", renderSignUp);

// '/'(루트) 엔드포인트에 대한 GET 요청 처리
// 홈 즉 index.html 라우팅
router.get("/", renderHome);

// '/main' 엔드포인트에 대한 GET 요청 처리. 로그인한 사용자만 렌더링
// 로그인 된 사용자의 홈 화면 라우팅
router.get("/main", isLoggedIn, renderMain);

// '/profile' 엔드포인트에 대한 GET 요청 처리. 로그인한 사용자만 렌더링
// 회원 정보 보기 폼 라우팅
router.get("/profile", isLoggedIn, renderProfile);

// '/account' 엔드포인트에 대한 GET 요청 처리. 로그인한 사용자만 렌더링
// 계좌 정보 화면 라우팅
router.get("/account", isLoggedIn, renderAccount);

// '/book/register' 엔드포인트에 대한 GET 요청 처리. 로그인한 사용자만 렌더링
// 도서 등록 폼 라우팅
router.get("/book/register", isLoggedIn, renderBookForm);

// '/list' 엔드포인트에 대한 GET 요청 처리. 로그인한 사용자만 렌더링
// 등록 된 도서 화면 라우팅
router.get("/list", isLoggedIn, renderBookList);

// '/book/:id' 엔드포인트에 대한 GET 요청 처리. 로그인한 사용자만 렌더링
// 등록 된 도서의 자세한 정보 화면 라우팅
router.get("/book/:id", isLoggedIn, renderBookDetails);

// 라우터 모듈을 외부로 내보냄
module.exports = router;
