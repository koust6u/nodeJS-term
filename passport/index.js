// 로컬 인증 전략 및 데이터베이스 모델을 가져옴
const local = require("./localStrategy");
const db = require(process.cwd() + "/models");
const passport = require("passport");
const cookieParser = require("cookie-parser");

// 모듈 내보내기
module.exports = () => {
  // 사용자 객체를 세션에 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 세션에 저장된 사용자 객체를 복원
  passport.deserializeUser(async (id, done) => {
    try {
      // 사용자 정보를 데이터베이스에서 조회
      const [rows] = await db.execute(
        "SELECT id, userId, nickname, img  FROM users WHERE id=?",
        [id]
      );

      // 조회된 사용자가 존재하면 해당 사용자 정보를 전달
      if (rows.length > 0) {
        const user = rows[0];
        done(null, user);
      } else {
        // 사용자가 존재하지 않으면 null 전달
        done(null);
      }
    } catch (err) {
      // 오류 발생 시 콘솔에 로그 출력 및 에러 전달
      console.error(err);
      done(err);
    }
  });

  // 로컬 전략 설정
  local();
};
