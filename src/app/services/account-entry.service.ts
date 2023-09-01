import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getHeadByCat_id(id:any):Observable<any>{
    return this.http.get<any>(this.baseApiUrl+'/Head/GetHeadbyCategory/'+id);
  }
}
