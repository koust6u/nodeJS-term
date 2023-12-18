// 모델 및 bcrypt 모듈 가져오기
const db = require(process.cwd() + "/models");
const bcrypt = require("bcrypt");

// 잔액 조회 및 충전 컨트롤러 함수
exports.loadBalance = async (req, res, next) => {
  try {
    // 충전할 잔액 가져오기
    const balance = req.body.chargeAmount;

    // 현재 로그인한 사용자 정보 조회
    const [member] = await db.execute(`SELECT * FROM users WHERE userId = ?`, [
      req.user.userId,
    ]);

    const pk = req.cookies.myPK;
    console.log(pk);
    const model = member[0];

    // 현재 사용자의 계정 잔액 조회
    const [prev] = await db.execute(
      `SELECT amount FROM account WHERE userId = ?`,
      [pk]
    );

    // 충전 후 총 잔액 계산 및 업데이트
    const total = parseInt(prev[0].amount) + parseInt(balance);
    await db.execute(`UPDATE account SET amount = ? WHERE userId = ?`, [
      total.toString(),
      model.id,
    ]);

    // 메인 페이지로 응답
    res.send("GET request to /main");
  } catch (err) {
    // 오류 발생 시 콘솔에 로그 출력 및 에러 핸들링
    console.error(err);
    next(err);
  }
};
