import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../model/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Submenu } from '../model/submenu';
import { AccessableMenu, MenuList, SubmenuUrl } from '../model/models';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http:HttpClient) { }

  getMenu():Observable<Menu[]>{
    return this.http.get<Menu[]>(this.baseApiUrl+'/Menuitem/GetAll');
  }

  getMenuList():Observable<MenuList[]>{
    return this.http.get<MenuList[]>(this.baseApiUrl+'/Menuitem/GetAll');
  }

  getSubmenuByItemno(item_no:number):Observable<SubmenuUrl[]>{
    return this.http.get<SubmenuUrl[]>(`${this.baseApiUrl}/Submenuitem/Submenuitembymenuitem/${item_no}`);
  }

  getAccessableSubmenu(user_key:number):Observable<any>{
    return this.http.get<any>(`${this.baseApiUrl}/Menuaccess/GetMenuaccessByUser_key/${user_key}`);
  }

  addAccessSubMenu(data:AccessableMenu):Observable<any>{
    return this.http.post(this.baseApiUrl+'/Menuaccess/Add',data);
  }

  getSubmenu(menuid:any):Observable<Submenu[]>{
    return this.http.get<Submenu[]>(this.baseApiUrl+'/Submenuitem/Submenuitembymenuitem/'+menuid);
  }

  getAllSubMenuAndMenu():Observable<any>{
    return this.http.get(this.baseApiUrl+'/Menuitem/menu-with-submenu');
  }

  getAllSubMenus():Observable<SubmenuUrl[]>{
    return this.http.get<SubmenuUrl[]>(this.baseApiUrl+'/Submenuitem/allSubmenu');
  }

  postSubmenu(submenu:SubmenuUrl):Observable<any>{
    return this.http.post(this.baseApiUrl+'/Submenuitem',submenu);
  }


  
}
