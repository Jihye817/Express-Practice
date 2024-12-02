const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    let sql = "SELECT * FROM teas";
    conn.query(sql, function (err, results) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "등록된 데이터가 없습니다." });
      }
    });
  })
  .post((req, res) => {
    let name = req.body.name;

    let sql = "INSERT INTO teas (name) VALUES (?)";
    if (name) {
      conn.query(sql, name, function (err, results) {
        res.status(201).json(results);
      });
    } else {
      res.status(400).json({
        message: "입력 값을 다시 확인해주세요",
      });
    }
  })
  .delete((req, res) => {
    let sql = "DELETE FROM teas";
    conn.query(sql, function (err, results) {
      res.status(200).json(results);
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let sql = "SELECT * FROM teas WHERE id = ?";
    conn.query(sql, id, function (err, results) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "id가 일치하는 Tea 정보가 없습니다." });
      }
    });
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let sql = "DELETE * FROM teas WHERE id = ?";
    conn.query(sql, id, function (err, results) {
      res.status(200).json(results);
    });
  })
  .put((req, res) => {
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

module.exports = router;
