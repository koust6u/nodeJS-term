// 로그인 여부 체크 미들웨어
exports.isLoggedIn = (req, res, next) => {
  // 사용자가 인증된 경우 다음 미들웨어로 이동
  if (req.isAuthenticated()) {
    next();
  } else {
    // 인증되지 않은 경우 홈페이지로 리다이렉트
    res.redirect("/");
  }
};

// 비로그인 여부 체크 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
  // 사용자가 인증되지 않은 경우 다음 미들웨어로 이동
  if (!req.isAuthenticated()) {
    next();
  } else {
    // 이미 로그인한 상태인 경우 메인 페이지로 리다이렉트
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect("/main");
  }
};
