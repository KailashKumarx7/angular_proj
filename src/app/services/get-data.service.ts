import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

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

  getDatabaseTables():Observable<any>{
    return this.http.get<any[]>(this.baseApiUrl+'/DataUpload/GetTables');
  }


  //get account list
  getAccountList():Observable<any>{
    return this.http.get<any[]>(this.baseApiUrl+'/Account/getAllAccount');
  }

  // getPartyledgerByAcKey(ac_key:any,sdate:any,edate:any):Observable<any>{
  //   return this.http.get<any[]>(`${this.baseApiUrl}/api/VoucherDetailForReport/getVoucherDetailByAckey/${ac_key}/${sdate}/${edate}`);
  // }

  getPartyledgerByAcKey(ac_key: any, SFormattedADDate: any, EFormattedADDate: any): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/VoucherDetailForReport/getVoucherDetailByAckey/${ac_key}/${SFormattedADDate}/${EFormattedADDate}`).pipe(
      catchError(error => {
        if(error.status==404)
        return throwError("Not Found");
        console.error(error);
        return throwError(error);
      })
    );
  }

  getVoucherTypes():Observable<any>{
    return this.http.get(this.baseApiUrl+"/VoucherType/getAllVoucherType");
  }
  
}
