import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../model/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Submenu } from '../model/submenu';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http:HttpClient) { }

  getMenu():Observable<Menu[]>{
    return this.http.get<Menu[]>(this.baseApiUrl+'/Menuitem/GetAll');
  }

  getSubmenu(menuid:any):Observable<Submenu[]>{
    return this.http.get<Submenu[]>(this.baseApiUrl+'/Submenuitem/Submenuitembymenuitem/'+menuid);
  }

  getAllSubMenuAndMenu():Observable<any>{
    return this.http.get(this.baseApiUrl+'/Menuitem/menu-with-submenu');
  }


  
}
