// import { vrefiyTokin } from "../auth/autHandler";
// import { ExpressHandler } from "../handlers/posthandler";
// import { db } from "../datastor/dao/Datastor";

// export const authMiddelware: ExpressHandler<any, any> = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).send({ error: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const payload = vrefiyTokin(token);
//     if (!payload || !payload.userId) {
//       return res.status(401).send({ error: "Invalid token" });
//     }

//     const user = await db.getUserById(payload.userId);
//     if (!user) {
//       return res.status(401).send({ error: "User not found" });
//     }

//     // ✅ خزّن الـ userId عشان تستخدمه بعدين
//     res.locals.userId = user.id;

//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err);
//     return res.status(401).send({ error: "Unauthorized" });
//   }
// };
import { vrefiyTokin } from "../auth/autHandler";
import { db } from "../datastor/dao/Datastor";
import { RequestHandler } from "express";

export const authMiddelware: RequestHandler = async (req, res, next) => {
  try {
    //  أولاً نحاول نجيب التوكن من الكوكي
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send({ error: "No token provided" });
    }

    // تحقق من التوكن
    const payload = vrefiyTokin(token);
    if (!payload || !payload.userId) {
      return res.status(401).send({ error: "Invalid token" });
    }

    // ✅ تحقق من وجود المستخدم في قاعدة البيانات
    const user = await db.getUserById(payload.userId);
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    // ✅ خزّن userId للاستعمال بعدين (مثلاً في إنشاء بوست)
    res.locals.userId = user.id;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).send({ error: "Unauthorized" });
  }
};
