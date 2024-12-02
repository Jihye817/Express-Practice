const express = require("express");
const app = express();
app.listen(1234);

const userRouter = require("./routes/users");
const teaRouter = require("./routes/teas");

app.use("/", userRouter);
app.use("/teas", teaRouter);
