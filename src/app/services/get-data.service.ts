import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http:HttpClient) { }

  getEmployees():Observable<any>{
    return this.http.get(this.baseApiUrl+'/Employeelist/getAll');
  }

  getByEmployeeKey(emp_key:number):Observable<any>{
    return this.http.get(`${this.baseApiUrl}/Employeelist/getByEmp_key/${emp_key}`);
  }

  getInstitutions():Observable<any>{
    return this.http.get(this.baseApiUrl+'/Institutionlist');
  }

  getByInstitutionKey(inst_key:number):Observable<any>{
    return this.http.get(`${this.baseApiUrl}/Institutionlist/getByInstitutionkey/${inst_key}`);
  }

  getFaculties():Observable<any>{
    return this.http.get(this.baseApiUrl+'/api/Facultylist/getAll');
  }

  getByFacultyKey(fac_key:number):Observable<any>{
    return this.http.get(`${this.baseApiUrl}/api/Facultylist/getByFacultyKey/${fac_key}`);
  }

  getAccesslists():Observable<any>{
    return this.http.get(this.baseApiUrl+'/Accesslist/getAll');
  }

  getByAccessKey(access_key:number):Observable<any>{
    return this.http.get(`${this.baseApiUrl}/Accesslist/getByAccessKey/${access_key}`);
  }
}
