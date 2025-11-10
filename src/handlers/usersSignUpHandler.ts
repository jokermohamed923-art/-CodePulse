import { User } from "../types";
import { RequestHandler } from "express-serve-static-core";
import { db } from "../datastor/dao/Datastor";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { signJwt } from "../auth/autHandler";

type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<Res>,
  Partial<Req>,
  any
>;

type SignUprequest = Pick<
  User,
  "userName" | "email" | "lastName" | "firstName" | "password"
>;

type SignUpResponse =
  | { user: Pick<User, "id" | "email" | "userName" | "firstName" | "lastName"> }
  | { error: string };

export const signUpHandler: ExpressHandler<SignUprequest, SignUpResponse> = async (req, res, next) => {
  try {
    const { firstName, email, userName, password, lastName } = req.body;

    // تحقق من الحقول
    if (!email || !password || !userName || !firstName || !lastName) {
      return res.status(400).send({ error: "Please provide all required fields" });
    }

    // تأكد إن المستخدم مش موجود
    const existing = (await db.getUserbyEmail(email)) || (await db.getUserByUsername(userName));
    if (existing) {
           console.log("🔸 المستخدم موجود بالفعل:", existing); 
      return res.status(409).send({ error: "User already exists" });
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم الجديد
    const user: User = {
      id: crypto.randomUUID(),
      email,
      lastName,
      firstName,
      userName,
      password: hashedPassword,
    };

    await db.createUser(user);

    // إنشاء JWT
    const jwt = signJwt({ userId: user.id});

    // 🔹 تخزين التوكن في كوكي آمنة
    res.cookie("token", jwt, {
      httpOnly: true,
      secure:false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // أسبوع
    });

    // 🔹 إرسال بيانات المستخدم فقط (بدون التوكن)
    return res.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        userName: user.userName,
      },
      
    });
    

  } catch (err: any) {
    next(err);
  }
};
