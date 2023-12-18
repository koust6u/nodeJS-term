// 데이터베이스 모델 및 bcrypt 모듈 가져오기
const db = require(process.cwd() + "/models");
const bcrypt = require("bcrypt");

// 프로필 업데이트 컨트롤러 함수
exports.updateProfile = async (req, res, next) => {
  try {
    // 입력된 비밀번호를 해시하여 암호화
    const hash = await bcrypt.hash(req.body.password, 12);

    // 사용자 정보 업데이트 쿼리 실행
    await db.execute(
      `UPDATE users SET nickname = ?, password = ?, description = ?, img = ? WHERE userId = ?`,
      [
        req.body.nickname,
        hash,
        req.body.description,
        req.body.img,
        req.user.userId,
      ]
    );

    // 메인 페이지로 리다이렉트
    return res.redirect("/main");
  } catch (err) {
    // 오류 발생 시 콘솔에 로그 출력 및 에러 핸들링
    console.error(err);
    next(err);
  }
};
