import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }


  migrateData(tableName: any, data: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/DataUpload/DataUpload/${tableName}`,data);
  }

}
