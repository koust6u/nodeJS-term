// 모델 및 bcrypt 모듈 가져오기
const db = require(process.cwd() + "/models");
const bcrypt = require("bcrypt");

// 도서 등록 컨트롤러 함수
exports.bookReg = async (req, res, next) => {
  const { title, content, price, img } = req.body;

  try {
    // 현재 로그인한 사용자의 ID 조회
    const [member] = await db.execute("SELECT id FROM users WHERE userId = ?", [
      req.user.userId,
    ]);

    // 도서 등록 쿼리 실행
    await db.execute(
      "INSERT INTO books (content, img, price, title, userId) VALUES (?,?,?,?,?)",
      [content, img, price, title, member[0].id]
    );

    // 메인 페이지로 리다이렉트
    res.redirect("/main");
  } catch (err) {
    // 오류 발생 시 콘솔에 로그 출력 및 에러 핸들링
    console.error(err);
    return next(err);
  }
};

// 도서 삭제 컨트롤러 함수
exports.deleteBook = async (req, res, next) => {
  try {
    // 현재 로그인한 사용자의 ID 조회
    const userId = req.user.userId;
    const [owner] = await db.execute("SELECT * FROM users WHERE userId = ?", [
      userId,
    ]);
    const userPk = owner[0].id;

    // 삭제할 도서의 정보 조회
    const [book] = await db.execute("SELECT * FROM books WHERE id = ? ", [
      req.params.id,
    ]);
    const bookUserPk = book[0].userId;

    // 현재 로그인한 사용자가 도서 소유자인 경우 도서 삭제
    if (userPk === bookUserPk) {
      await db.execute("DELETE FROM books WHERE id = ?", [req.params.id]);
      res.redirect("/main");
    } else {
      res.send("invalid access");
    }
  } catch (err) {
    // 오류 발생 시 콘솔에 로그 출력 및 에러 핸들링
    console.error(err);
    return next(err);
  }
};

// 도서 수정 컨트롤러 함수
exports.updateBook = async (req, res, next) => {
  try {
    // 수정할 도서 정보
    const { price, content, title } = req.body;

    // 현재 로그인한 사용자의 ID 조회
    const [owner] = await db.execute("SELECT * FROM users WHERE userId = ?", [
      req.user.userId,
    ]);
    const userPk = owner[0].id;

    // 수정할 도서의 정보 조회
    const [book] = await db.execute("SELECT * FROM books WHERE id = ? ", [
      req.params.id,
    ]);
    const bookUserPk = book[0].userId;

    // 현재 로그인한 사용자가 도서 소유자인 경우 도서 수정
    if (userPk === bookUserPk) {
      await db.execute(
        "UPDATE books SET price = ?, content = ?, title = ?  WHERE id= ?",
        [price, content, title, req.params.id]
      );
      res.redirect("/list");
    } else {
      res.send("/error");
    }
  } catch (err) {
    // 오류 발생 시 콘솔에 로그 출력 및 에러 핸들링
    console.error(err);
    return next(err);
  }
};

// 도서 구매 컨트롤러 함수
exports.purchaseBook = async (req, res, next) => {
  try {
    // 구매자 및 도서 정보 조회
    const [buyer] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.cookies.myPK,
    ]);
    const [book] = await db.execute("SELECT * FROM books WHERE id = ?", [
      req.params.id,
    ]);
    const ownerId = book[0].userId;
    const [owner] = await db.execute("SELECT * FROM users WHERE id = ?", [
      ownerId,
    ]);
    const price = book[0].price;

    // 구매자 및 소유자 계정 정보 조회
    const [buyerAccount] = await db.execute(
      "SELECT * FROM account WHERE userId = ? ",
      [buyer[0].id]
    );
    const [ownerAccount] = await db.execute(
      "SELECT * FROM account WHERE userId = ?",
      [owner[0].id]
    );

    // 이전 계좌 잔액 및 새로운 잔액 계산
    const prevAmountOfOwner = ownerAccount[0].amount;
    const prevAmountOfBuyer = buyerAccount[0].amount;
    const nextAmountOfOwner = prevAmountOfOwner + price;
    const nextAmountOfBuyer = prevAmountOfBuyer - price;

    // 구매자의 잔액이 부족한 경우 에러 메시지 출력
    if (nextAmountOfBuyer < 0) {
      res.redirect("/list?error=잔액 부족!");
    } else {
      // 소유자 및 구매자 계정 업데이트 및 도서 삭제
      const ownerPk = owner[0].id;
      const buyerPk = buyer[0].id;
      await db.execute("UPDATE account SET amount = ? WHERE userId = ?", [
        nextAmountOfOwner.toString(),
        ownerPk,
      ]);
      await db.execute("UPDATE account SET amount = ? WHERE userId = ?", [
        nextAmountOfBuyer.toString(),
        buyerPk,
      ]);
      await db.execute("DELETE FROM books WHERE id = ?", [req.params.id]);
    }

    // 도서 목록 페이지로 리다이렉트
    res.redirect("/list");
  } catch (err) {
    // 오류 발생 시 콘솔에 로그 출력 및 에러 핸들링
    console.error(err);
    return next(err);
  }
};
