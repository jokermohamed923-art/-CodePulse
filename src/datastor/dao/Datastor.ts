import {UserDao} from'././UserDao'
import { PostDao } from '././PostDao'
import { LikeDao } from '././likeDao'
import { CommentDao } from '././commentDao'
import {SqlDataStore} from"../../datastor/sql"
export interface DatastorDao extends UserDao,PostDao,LikeDao,CommentDao {}; // datastor بيشتال كل opject الي تتفذ method معينه
 export let db:DatastorDao

 export async function InitDb(){ //الداله بتعمل اتصالي ب db
    db= await new SqlDataStore().openDb()
 }