//express 모듈 만들기
const express = require("express");
const app = express();

//기본 데이터 넣기
let tea1 = {
  type: "Green Tea",
  quantity: 100,
  bookmarked: 14,
};
let tea2 = {
  type: "Darjeeling",
  quantity: 70,
  bookmarked: 34,
};
let tea3 = {
  type: "English Breakfast",
  quantity: 215,
  bookmarked: 57,
};

let teaList = [tea1, tea2, tea3];

//데이터베이스 역할의 map을 만들어 기존 데이터를 넣어주기
let db = new Map();
teaList.map((item) => db.set(db.size + 1, item));

//전체 조회
app.get("/teas", (req, res) => {
  res.json(Object.fromEntries(db)); //map to json을 하기 위해 Object.formEntries() 사용
});

//개별 조회
app.get("/teas/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const tea = db.get(id);
  if (tea === undefined) {
    res.json({ message: "id가 일치하는 Tea 정보가 없습니다." });
  } else {
    res.json(tea);
  }
});

//등록
app.use(express.json()); //미들웨어 설정
app.post("/teas", (req, res) => {
  let newTea = req.body;
  db.set(db.size + 1, newTea);
  res.json({
    message: `${db.get(db.size).type}가 성공적으로 등록되었습니다.`,
  });
});

//포트 설정
app.listen(1234);
