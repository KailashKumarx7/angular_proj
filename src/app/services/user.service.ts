import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewUser } from '../model/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http:HttpClient) {

   }
  

  getAllUsers():Observable<NewUser[]>{
    return this.http.get<NewUser[]>(this.baseApiUrl+'/User/GetAllUsers');
  }

  addNewUser(newUser:any):Observable<any>{
    return this.http.post(this.baseApiUrl+'/User',newUser);
  }

  getUserByUserkey(user_key:number):Observable<any>{
    return this.http.get(`${this.baseApiUrl}/User/getUserbyUser_key/${user_key}`);
  }

  updateUserByUserkey(user_key:number,userData:any):Observable<any>{
    return this.http.put(`${this.baseApiUrl}/User/updateUserbyuserKey/${user_key}`,userData)
  }


}
