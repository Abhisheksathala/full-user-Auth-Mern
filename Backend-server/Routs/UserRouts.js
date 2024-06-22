import express from "express";
import {
  LoginUser,
  RegisterUser,
  google,
  updateUser,
  deleteUser,
} from "../Controllers/UserContoller.js";
import verifyToken from "../utils/VerifyUser.js";

const UserRouter = express.Router();

UserRouter.post("/signin", LoginUser);
UserRouter.post("/signup", RegisterUser);
UserRouter.post("/google", google);
UserRouter.put("/update/:id", verifyToken, updateUser);
UserRouter.delete("/delete/:id",verifyToken, deleteUser);

export default UserRouter;
