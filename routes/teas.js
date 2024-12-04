const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

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
  .post(
    [
      body("name").notEmpty().isString().withMessage("이름을 확인해주세요."),
      validate,
    ],
    (req, res) => {
      let { name } = req.body;

      let sql = "INSERT INTO teas (name) VALUES (?)";
      conn.query(sql, name, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        res.status(201).json(results);
      });
    }
  )
  .delete((req, res) => {
    let sql = "DELETE FROM teas";
    conn.query(sql, function (err, results) {
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

router
  .route("/:id")
  .get(
    [
      param("id").notEmpty().isInt().withMessage("id값이 있어야 합니다."),
      validate,
    ],
    (req, res) => {
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
          res
            .status(404)
            .json({ message: "id가 일치하는 Tea 정보가 없습니다." });
        }
      });
    }
  )
  .delete(
    [
      param("id").notEmpty().isInt().withMessage("id값이 있어야 합니다."),
      validate,
    ],
    (req, res) => {
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
    }
  )
  .put(
    [
      param("id").notEmpty().isInt().withMessage("id값이 있어야 합니다."),
      param("name")
        .notEmpty()
        .isString()
        .withMessage("이름을 확인해주세요."),
      validate,
    ],
    (req, res) => {
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
    }
  );

module.exports = router;
