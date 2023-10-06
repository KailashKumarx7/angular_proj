import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Category } from '../model/models';

@Injectable({
  providedIn: 'root'
})
export class AccountEntryService {

  baseApiUrl:String = environment.baseApiUrl;
  
  constructor(private http:HttpClient) { 

  }


  getCategory():Observable<Category[]>{
    return this.http.get<Category[]>(this.baseApiUrl+'/Category/getAll');
  }

  getHeadByCatId(id:any):Observable<any>{
    return this.http.get<any>(this.baseApiUrl+'/Head/GetHeadbyCategory/'+id);
  }

  getSubheadByCatId(id:any):Observable<any>{
    return this.http.get<any>(this.baseApiUrl+'/Subhead/getByCatKey/'+id);
  }

  getSuhheadByHeadKey(head_key:any):Observable<any>{
    return this.http.get<any>(this.baseApiUrl+'/Subhead/getByHeadKey/'+head_key);
  }

  getAccountByCatKey(cat_key:any):Observable<any>{
    return this.http.get<any>(this.baseApiUrl+'/Account/getAccountByCatKey/'+cat_key);
  }

  getAccountBySubHeadKey(sub_head_key:any):Observable<any>{
    return this.http.get<any>(this.baseApiUrl+'/Account/getAccountByHeadKey/'+sub_head_key);
  }

  addAccount(data:any):Observable<any>{
    return this.http.post<any>(`${this.baseApiUrl}/Account`,data);
  }

  updateAccount(id:number,data:any):Observable<any>{
    return this.http.put<any>(`${this.baseApiUrl}/Account/updateAccount/${id}`,data);
  }

  addHead(data: any): Observable<any> {
    console.log('Sending data:', data);
    return this.http.post<any>(`${this.baseApiUrl}/Head/AddHead`, data)
      .pipe(
        tap(response => {
          console.log('Response:', response);
        })
      );
  }
  
}
