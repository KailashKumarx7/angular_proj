import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Login } from '../model/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http:HttpClient) { }


  login(data:Login):Observable<any>{
    return this.http.post(`${this.baseApiUrl}/User/authenticate`, data);
  }
}
