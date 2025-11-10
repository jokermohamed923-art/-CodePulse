
import {Post} from"../../types"
export interface PostDao{
    listPost():Promise<Post[]>; //بترجع مصفوفة من نوع Post
    createPost(post:Post):Promise<void> 
    getPostById(id:string):Promise<Post|undefined>
    deletePost(postId:string,userId:string):Promise<void>

}