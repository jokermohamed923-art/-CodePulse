export interface User{
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    userName:string;
    password:string;
} 
 export interface Post {
    id : string;
    title:string;
    url:string;
    postAT:number;
    userId:string;
 userName?:string;

 }
 export interface Like {
    id :string,
    userId:string;
    postId:string;
 }
 export interface Commnet{
    id :string;
    userId:string;
    text:string;
     postId:string;
    createdAt:string;
 }
 // pyaylod in outh
export interface jwtopject { // دا تايب يعني البيلود اللي هيتحط في payload 
   userId :string;

}