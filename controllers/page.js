// 모델 및 컨트롤러 함수들 가져오기
const db = require(process.cwd() + "/models");

// 로그인 화면 렌더링
exports.renderLogin = (req, res) => {
  res.render("login", { title: "로그인 - 온라인 도서관 플랫폼" });
};

// 회원가입 화면 렌더링
exports.renderSignUp = (req, res) => {
  res.render("signup", { title: "회원가입 - 온라인 도서관 플랫폼" });
};

// 프로필 화면 렌더링
exports.renderProfile = async (req, res, next) => {
  try {
    const [member] = await db.execute(`SELECT * FROM users WHERE userId = ?`, [
      req.user.userId,
    ]);
    const model = member[0];
    res.render("profile", {
      imgSrc: model.img,
      model,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 메인 화면 렌더링
exports.renderMain = async (req, res, next) => {
  try {
    const [member] = await db.execute(`SELECT * FROM users WHERE userId = ?`, [
      req.user.userId,
    ]);
    const model = member[0];

    try {
      const [findUser] = await db.execute(
        "select * from users where userId = ?",
        [req.user.userId]
      );
      res.setHeader("Set-Cookie", "myPK=" + findUser[0].id + "; Path=/;");
    } catch (e) {
      console.error(e);
      return next(e);
    }

    res.render("main", {
      title: "온라인 도서 대출 플랫폼",
      imgSrc: model.img,
      model,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 홈 화면 렌더링
exports.renderHome = (req, res) => {
  res.render("index", { title: "회원가입 - 온라인 도서관 플랫폼" });
};

// 도서 등록 화면 렌더링
exports.renderBookForm = (req, res) => {
  res.render("book");
};

// 계정 화면 렌더링
exports.renderAccount = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const [member] = await db.execute("SELECT * FROM users WHERE userId = ?", [
      id,
    ]);

    const pk = req.cookies.myPK;
    console.log(pk);

    const model = member[0];
    const [account] = await db.execute(
      "SELECT * FROM account WHERE userId = ?",
      [pk]
    );

    const accountModel = account[0];
    res.render("account", {
      accountLog: accountModel.updatedAt,
      balance: accountModel.amount,
      model,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 도서 목록 화면 렌더링
exports.renderBookList = async (req, res, next) => {
  try {
    // 페이지 및 페이지 크기 설정
    const page = parseInt(req.query.page) || 1;
    const pageSize = 9;
    const offset = (page - 1) * pageSize;

    try {
      // 총 도서 수 조회
      const count = await db.execute("SELECT COUNT(*) FROM books");

      // 도서 목록 조회
      const [books] = await db.execute(
        "SELECT * FROM books ORDER BY createdAt DESC LIMIT ? OFFSET ?",
        [pageSize.toString(), offset.toString()]
      );

      // 페이지 수 계산 후 도서 목록 화면 렌더링
      res.render("bookList", {
        books,
        page,
        count: parseInt(count) / page,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).send("Internal Server Error");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 도서 상세 정보 화면 렌더링
exports.renderBookDetails = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    // 도서 정보 조회
    const [book] = await db.execute("SELECT * FROM books WHERE id = ?", [
      bookId,
    ]);
    const detail = book[0];

    // 현재 로그인한 사용자 정보 조회
    const [member] = await db.execute("SELECT * FROM users WHERE userId = ?", [
      req.user.userId,
    ]);
    const memberDetail = member[0];

    // 현재 도서 소유자 여부 확인
    const flag = memberDetail.id === detail.userId;

    // 도서 소유자 정보 조회
    const [memberId] = await db.execute("SELECT * FROM users WHERE id = ?", [
      detail.userId,
    ]);
    const members = memberId[0];

    // 도서 상세 정보 화면 렌더링
    res.render("bookDetail", {
      detail,
      members,
      isMine: flag,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Internal Server Error");
  }
};
