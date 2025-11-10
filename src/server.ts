import dotenv from "dotenv";
import express, { ErrorRequestHandler, RequestHandler } from "express";
import { InitDb } from './datastor/dao/Datastor';
import { listpost, createpost} from "./handlers/posthandler";
import {getPostById} from"./handlers/getposrByid"
import { SignIn } from './handlers/usersSignInHandler';
import { signUpHandler } from "./handlers/usersSignUpHandler";
import { authMiddelware } from "../src/Middleware/authMiddleware";
import { createCommentHandler, listCommentHandler } from "./handlers/createComment";
import { deletePostHandler } from "./handlers/deletePostHandler";
import cors from 'cors';
import cookieParser from "cookie-parser";


dotenv.config({ path: __dirname + "/../.env" });

(async () => {
  await InitDb();
  const app = express();
  app.use(express.json());

app.use(cookieParser());
  // تعريف الميدلوير قبل المسارات
  const requestLogger: RequestHandler = (req, res, next) => {
    console.log('now request', req.path, 'body', req.body);
    next();
  };
  app.use(requestLogger);

  const port = 3000;
app.use(cors({
  origin: "http://localhost:3002", // عنوان الفرونت
  credentials: true, // 🔥 يسمح بإرسال الكوكيز
}));

  app.post("/signUp", signUpHandler);
  app.post("/signIn", SignIn);
  app.use(authMiddelware);
  app.post("/posts", createpost);
  app.get("/posts", listpost);
  app.get("/posts/:id", getPostById);
  app.delete("/posts/:postId/delete",deletePostHandler)
  app.post("/posts/:postId/comments", createCommentHandler);
  app.get("/posts/:postId/comments", listCommentHandler);


  // في الباك اند (Express):


  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error("uncaught exception", err);
    return res.status(500).send('oops, an unexpected error please try again');
  };
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
