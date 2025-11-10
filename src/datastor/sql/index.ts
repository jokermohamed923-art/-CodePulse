
import {DatastorDao}from'../dao/Datastor';
import { User, Post, Like, Commnet } from '../../types';
import sqlite3  from 'sqlite3';
import { open,Database } from "sqlite";
import path from 'path';

export class SqlDataStore implements DatastorDao{
private db!:Database<sqlite3.Database,sqlite3.Statement>
   public async openDb(){
      this.db =await open({ //open: دي من مكتبة sqlite، بتفتح أو تنشئ قاعدة بيانات جديدة.
filename: path.resolve("myapps.sqlite"),

         driver:sqlite3.Database
        })
        this.db.run("PRAGMA foreign_keys= ON;")
          await this.db.migrate({migrationsPath:path.join(__dirname,"../sql/migrations")})
       return this
          };
    async createUser (user: User): Promise<void> {
 await this.db.run(
    "INSERT  INTO users(id,firstName,userName,lastName,email,password) VALUES (?,?,?,?,?,?) ",
      user.id,
      user.firstName,
      user.userName,
      user.lastName,
      user.email,
      user.password
    );
   
    }
    getUserById(id: string): Promise<User | undefined> {
    return this.db.get<User>("SELECT * FROM users WHERE id = ?", id)
  }
   getUserbyEmail(email: string): Promise<User | undefined> {
   return this.db.get<User>(`SELECT * FROM users WHERE email =?`,email)
    }
    getUserByUsername(userName: string): Promise<User | undefined> {
   return this.db.get<User>(`SELECT * FROM users WHERE userName = ?`,userName)
    }
    
listPost(): Promise<(Post & { userName: string })[]> {
  return this.db.all<(Post & { userName: string })[]>(
    `SELECT posts.*, users.userName
     FROM posts
     INNER JOIN users ON posts.userId = users.id
     ORDER BY posts.postAt DESC`
  );
}


   async createPost(post: Post): Promise<void> {    
      await this.db.run( 'INSERT INTO posts (id, userId, title, url, postAt) VAlUES (?,?,?,?,?)',
        post.id,
        post.userId,
        post.title,
        post.url,
        post.postAT
      ) ;
         }
  async getPostById(id: string): Promise<Post | undefined> {
  const post = await this.db.get<Post>(
    `SELECT posts.*, users.userName
     FROM posts
     INNER JOIN users ON posts.userId = users.id
     WHERE posts.id = ?`,
    id
  );
  return post;
}
async deletePost(postId: string, userId: string): Promise<void> {
  await this.db.run("DELETE FROM posts WHERE id = ? AND userId = ?", postId, userId);
}

  async createLike(like: Like): Promise<void> {
  await this.db.run(
    "INSERT INTO likes (id, userId, postId, createdAt) VALUES (?, ?, ?, ?)",
    like.id,
    like.userId,
    like.postId,
   
  );
}

   async createComment(comment: Commnet): Promise<void> {
  await this.db.run(
    "INSERT INTO comments (id, postId, userId, text, createdAt) VALUES (?, ?, ?, ?, ?)",
    comment.id,
    comment.postId,
    comment.userId,
    comment.text,
    comment.createdAt
  );
}

// async createComment(comment:Commnet) :Promise<void>{
//   await this.db.run(
//     `INSERT INTO comments (id,userId,postId,text,createdAt) VALUES (?,?,?,?,?),
//     comment.id,
//     comment.userId,
//     comment.postId,
//     comment.text,
//     comment.createdAt
//     `
//   )
// }
async listComment(postId: string): Promise<(Commnet & { userName: string })[]> {
  return this.db.all<(Commnet & { userName: string })[]>(
    `SELECT comments.*, users.userName
     FROM comments
     INNER JOIN users ON comments.userId = users.id
     WHERE comments.postId = ?
     ORDER BY comments.createdAt ASC`,
    postId
  );
}


   async deleteComment(id: string): Promise<void> {
  await this.db.run("DELETE FROM comments WHERE id = ?", id);
}

}
