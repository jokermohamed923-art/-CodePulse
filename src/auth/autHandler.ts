import { exit } from "process";
import { jwtopject } from "../types";
import Jwt  from "jsonwebtoken";
///////////////////
export function signJwt(payload:jwtopject):string{ // الداله دي مفروض ان هبنعت ليها opj 
    //  الي هنبعت للداله هو محدد التايب قبل كده opject نوع  
    // useId:string
// grtscretkey المبعوت والمفتاح الي موجود في الدالهopjبتاالي التحقق من ال 
return Jwt.sign(payload,getScretkey(),{expiresIn:"15d"}) //انشاء توكن 
}
// ///////////////////////////

export function vrefiyTokin(token:string):jwtopject{ // المفروض دي داله بتاخد token وتتحق منه 
    // التجحقق من التوكن 
    return Jwt.verify(token,getScretkey()) as jwtopject  ;
}
/////////////////////////////
 export function getScretkey ():string{ //typecriptالدالع دي المفروض انها بتتحقق من المفتاح موجود ولا الاء عشان ا
  const scretkye=process.env.JWT_SECRET
  if(!scretkye){
    console.error("missing scretkey");/// لو مش مودجود اعلمل ابقاف تشغيل السيرفر 
    process.exit(1) 
  }
  
  return scretkye; //   رجع   الفتاح الي مبعوت في 
 }/// opjعشان استخدمه في عمل  التوكن  الي بعوت في