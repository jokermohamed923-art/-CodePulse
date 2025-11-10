import {Commnet} from"../../types"
export interface CommentDao{
    createComment(comment:Commnet):Promise<void> //ينششئ كومنت من 
    listComment(postId:string):Promise<Commnet[]>// برجع مل الكومنت 
    deleteComment(id:string):Promise<void> // بيح1ف الكومن مش بيرجع حاجه
}