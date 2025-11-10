import { User } from "../types";
import { db } from "../datastor/dao/Datastor";
import { RequestHandler } from "express-serve-static-core";
import bcrypt from "bcrypt";
import { signJwt } from "../auth/autHandler";

// ✅ Type Helper
type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<Res>,
  Partial<Req>,
  any
>;

//  أنواع البيانات
interface SignInRequest {
  login: string; // ممكن يكون email أو userName
  password: string;
}

type SignInResponse =
  | {
      user: Pick<User, "userName" | "email" | "lastName" | "firstName" | "id">;
    }
  | { error: string };

//  الدالة الأساسية
export const SignIn: ExpressHandler<SignInRequest, SignInResponse> = async (
  req,
  res
) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).send({ error: "Missing login or password" });
  }

  // 🔍 ابحث عن المستخدم سواء بالـ email أو الـ username
  const existing =
    (await db.getUserByUsername(login)) || (await db.getUserbyEmail(login));

  if (!existing) {
    return res.status(400).send({ error: "User not found" });
  }

  // 🔑 تحقق من كلمة المرور
  const isMatch = await bcrypt.compare(password, existing.password);
  if (!isMatch) {
    return res.status(400).send({ error: "Invalid credentials" });
  }

  // إنشاء JWT
  const jwt = signJwt({ userId: existing.id });

  //  تخزين التوكن داخل كوكي آمنة
  res.cookie("token", jwt, {
    httpOnly: true, // لا يمكن الوصول لها من JavaScript
    secure: process.env.NODE_ENV === "production", // https فقط في الإنتاج
    sameSite: "lax", // تقليل احتمالية CSRF
    maxAge: 1000 * 60 * 60 * 24 * 7, // أسبوع
  });

  // ✅ إرسال بيانات المستخدم فقط
  return res.status(200).send({
    user: {
      id: existing.id,
      firstName: existing.firstName,
      lastName: existing.lastName,
      email: existing.email,
      userName: existing.userName,
    },
  });
};
