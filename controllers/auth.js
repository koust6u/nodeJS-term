// bcrypt, passport 및 모델 가져오기
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require(process.cwd() + "/models");

// 회원가입 컨트롤러 함수
exports.signup = async (req, res, next) => {
  const { userId, nickname, password, img, description } = req.body;
  try {
    // 이미 존재하는 사용자인지 확인
    const [rows] = await db.execute("SELECT * FROM users WHERE userId=?", [
      userId,
    ]);
    if (rows.length > 0) {
      return res.redirect("/?error=이미 존재하는 회원압니다.");
    }

    // 비밀번호 해시 생성
    const hash = await bcrypt.hash(password, 12);

    // 사용자 등록 및 계정 및 권한 정보 초기화
    await db.execute(
      "INSERT INTO users (userId, nickname, password, img, description )" +
        " VALUES (?, ?, ?, ?, ?)",
      [userId, nickname, hash, img, description]
    );

    const [members] = await db.execute("SELECT * FROM users WHERE userId= ? ", [
      userId,
    ]);
    const id = members[0].id;

    await db.execute("INSERT INTO account(amount, userId) VALUES(?,?)", [
      0,
      id,
    ]);
    await db.execute("INSERT INTO authority(role, userId) VALUES(?,?)", [
      "NORMAL",
      id,
    ]);

    // 홈페이지로 리다이렉트
    return res.redirect("/");
  } catch (err) {
    // 오류 발생 시 콘솔에 로그 출력 및 에러 핸들링
    console.error(err);
    return next(err);
  }
};

// 로그인 컨트롤러 함수
exports.login = async (req, res, next) => {
  passport.authenticate("local", (authErr, user, info) => {
    if (authErr) {
      // 인증 오류 시 콘솔에 로그 출력 및 에러 핸들링
      console.error(authErr);
      return next(authErr);
    }
    if (!user) {
      // 사용자 정보가 없는 경우 에러 메시지를 포함하여 홈페이지로 리다이렉트
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginErr) => {
      if (loginErr) {
        // 로그인 오류 시 콘솔에 로그 출력 및 에러 핸들링
        console.error(loginErr);
        return next(loginErr);
      }
      // 메인 페이지로 리다이렉트
      return res.redirect("/main");
    });
  })(req, res, next);
};

// 로그아웃 컨트롤러 함수
exports.logout = (req, res) => {
  // Passport를 사용하여 로그아웃 후 홈페이지로 리다이렉트
  req.logout(() => {
    res.redirect("/");
  });
};
