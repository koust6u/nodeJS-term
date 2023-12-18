// Passport 및 관련 모듈 가져오기
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require(process.cwd() + "/models");

// 모듈 내보내기
module.exports = () => {
  // 로컬 전략 설정
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userId", // 사용자 아이디 필드 설정
        passwordField: "password", // 비밀번호 필드 설정
        passReqToCallback: false,
      },
      async (userId, password, done) => {
        try {
          // 사용자 아이디로 데이터베이스에서 사용자 정보 조회
          const [rows] = await db.execute(
            "SELECT * FROM users WHERE userId=?",
            [userId]
          );

          // 조회된 사용자 정보가 있으면 비밀번호 비교
          if (rows.length > 0) {
            const result = await bcrypt.compare(password, rows[0].password);

            // 비밀번호가 일치하면 사용자 정보 전달
            if (result) {
              done(null, rows[0]);
            } else {
              // 비밀번호가 일치하지 않으면 인증 실패 및 메시지 전달
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            // 조회된 사용자 정보가 없으면 인증 실패 및 메시지 전달
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (err) {
          // 오류 발생 시 콘솔에 로그 출력 및 에러 전달
          console.error(err);
          done(err);
        }
      }
    )
  );
};
