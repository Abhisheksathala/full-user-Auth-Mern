import express from "express";
import connectDB from "./Db/IndexDB.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./Routs/UserRouts.js";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//api createtion
app.use("/api/v1/user", UserRouter);

connectDB()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("hello world");
    });

    app.listen(process.env.PORT, (req, res) => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB GOT ERROR:", error);
  });
