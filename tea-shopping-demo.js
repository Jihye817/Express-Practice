//express 모듈 만들기
const express = require("express");
const app = express();
app.use(express.json()); //미들웨어 설정
app.listen(1234); //포트 설정

/** data format
 * let tea = {
 *  tea : "Green Tea",
 *  quantity : 100,
 *  bookmarked: 10
 * }
 */

//데이터베이스 역할의 map을 만들기
let db = new Map();

//전체 조회
app.get("/teas", (req, res) => {
  if (db.size != 0) {
    res.status(200).json(Object.fromEntries(db)); //map to json을 하기 위해 Object.formEntries() 사용
  } else {
    res.status(404).json({ message: "등록된 데이터가 없습니다." });
  }
});

//개별 조회
app.get("/teas/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const tea = db.get(id);
  if (tea) {
    res.status(200).json(tea);
  } else {
    res.status(404).json({ message: "id가 일치하는 Tea 정보가 없습니다." });
  }
});

//등록
app.post("/teas", (req, res) => {
  let newTea = req.body;
  db.set(db.size + 1, newTea);
  if (req.body.type && req.body.quantity && req.body.bookmarked) {
    res.status(201).json({
      message: `${db.get(db.size).type}가 성공적으로 등록되었습니다.`,
    });
  } else {
    res.status(400).json({
      message: "입력 값을 다시 확인해주세요",
    });
  }
});

//개별 삭제
app.delete("/teas/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const tea = db.get(id);
  if (tea) {
    db.delete(id);
    res.status(200).json({
      message: `${tea.type}의 정보가 삭제되었습니다.`,
    });
  } else {
    res.status(404).json({
      message: "id가 일치하는 Tea 정보가 없습니다.",
    });
  }
});

//전체 삭제
app.delete("/teas", (req, res) => {
  if (db.size != 0) {
    db.clear(); //map의 모든 객체를 삭제
    res.status(200).json({
      message: "전체 Tea 데이터가 삭제되었습니다",
    });
  } else {
    res.status(404).json({
      message: "삭제할 데이터가 없습니다.",
    });
  }
});

//개별 수정
app.put("/teas/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const tea = db.get(id);
  let statusCode = 200;

  if (tea) {
    let oldTea = { ...tea }; //이전 데이터.
    //객체이므로 객체를 복사해준다. let oldTea = tea 이면 같은 데이터를 참조하기 때문에 tea의 내용을 바꾸면 oldTea 내용이 같이 바뀜
    let newTea = req.body; //수정 데이터

    let msg = `Tea id : ${id}의 데이터 `;
    if (newTea.type != undefined && oldTea.type != newTea.type) {
      tea.type = newTea.type;
      msg += `${oldTea.type}가 ${newTea.type}으로 변경되었습니다. `;
    }
    if (newTea.quantity != undefined && oldTea.quantity != newTea.quantity) {
      tea.quantity = newTea.quantity;
      msg += `총 갯수가 ${oldTea.quantity}개 에서 ${newTea.quantity}개로 변경되었습니다. `;
    }
    if (
      newTea.bookmarked != undefined &&
      oldTea.bookmarked != newTea.bookmarked
    ) {
      tea.bookmarked = newTea.bookmarked;
      msg += `북마크 수가 ${oldTea.bookmarked}개 에서 ${newTea.bookmarked}개로 변경되었습니다. `;
    }

    //변경할 데이터가 기존과 같은 경우
    if (
      oldTea.type == newTea.type &&
      oldTea.quantity == newTea.quantity &&
      oldTea.bookmarked == newTea.bookmarked
    ) {
      statusCode = 404;
      msg = "변경할 데이터가 기존 데이터와 같습니다.";
    }

    db.set(id, tea); //id가 일치하는 곳의 객체 수정

    res.status(statusCode).json({
      message: msg,
    });
  } else {
    res.status(404).json({ message: "Tea 정보를 찾을 수 없습니다." });
  }
});
