import { RequestHandler } from "express"
import {db} from"../datastor/dao/Datastor"
import { Post } from "../types"
import crypto from'crypto'

//errorالمطلوب هانا التحققمن من صحه الباينات المبعوته في البدي بحيث لوفي اي خطا في البيانات المبعوته يعمبل 

export type ExpressHandler<Req,Res>=RequestHandler<
string,
Partial<Res>,
Partial<Req>,
any
>;

 // الي بيعمله هو بيتحقق من req ,res types
// posts فاضي عشان من عاوز ابعت حاجه انا عاوز opject بياخد  
type getPostrespons={
    posts:Post[];
}
type getPostrequest={}

// بحيث ان لو في طب جه ينفذ المدلوير
 export const listpost:ExpressHandler<getPostrespons,getPostrequest>=(async (req,res,next)=>{
    // console.log(req.headers.authorization)
     const posts = await db.listPost();
 return res.status(200).send({ posts }); // نعمل كائن نحط فيه البوستات
})

type createPostRequest=Pick<Post, 'title'|'url'>; // body في expresshandler خد    كده بنقوله
type createPostRespons={}

export const createpost:ExpressHandler<createPostRequest,createPostRespons>=async (req,res,next)=>{ // كده حطيناالبوست في البدي

try{ 
    if (!req.body.title||!req.body.url)
///expresshandler  بتحقق من الطلب الي جاي في البدي  بسخدام 
   {
  return  res.status(400).send("Please provide all required fields")
   ;
   };


const post:Post={
   id:crypto.randomUUID(),
   postAT:Date.now(),
   title:req.body.title,
   url:req.body.url,
   userId:res.locals.userId  
   
   //  جاي من اليوزر الي تحقنا منهid هنا 
};

await db.createPost(post);
 return res.sendStatus(200)}catch(err:any){
    next(err)
    
 }
    // لازم يكون البدي في متغير عشان نتعرف نتحقق منه بعد كده
}