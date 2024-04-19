const express = require("express");
const { connection } = require("./db/db");
const { userRouter } = require("./routes/user.routes");

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.listen(4500, async () => {
  try {
    await connection;
    console.log("Database is connected");
    console.log("server started");
  } catch (error) {
    console.log(error.message);
  }
});
