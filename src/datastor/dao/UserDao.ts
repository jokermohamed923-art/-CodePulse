
import {User} from"../../types"
export interface UserDao {
    createUser(user:User):Promise<void> // method بتاخد user من نوعلا User 
    getUserbyEmail(email:string):Promise<User|undefined>
    getUserById(id:string):Promise<User|undefined>
     getUserByUsername(userName:string):Promise<User|undefined>
}