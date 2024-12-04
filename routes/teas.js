const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    let sql = "SELECT * FROM teas";
    conn.query(sql, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }
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
      if (err) {
        console.log(err);
        return res.status(400).end();
      }
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
      if (err) {
        console.log(err);
        return res.status(400).end();
      }
      if (results.affectedRows == 0) {
        return res.status(400).end();
      } else {
        res.status(200).json(results);
      }
    });
  })
  .put((req, res) => {
    let { id } = req.params;
    let { name } = req.body;
    id = parseInt(id);

    let sql = "UPDATE teas SET name = ? WHERE id = ?";
    let values = [name, id];
    conn.query(sql, id, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }
      if (results.affectedRows == 0) {
        return res.status(400).end();
      } else {
        res.status(200).json(results);
      }
    });
  });

module.exports = router;
