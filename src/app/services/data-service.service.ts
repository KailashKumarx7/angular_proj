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


  migrateData(tableName: string, data: File): Observable<any> {
    const formData = new FormData();
    formData.append('FilePath', '');
    formData.append('FileContent', data);

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    return this.http.post(`${this.baseApiUrl}/DataUpload/DataUpload/${tableName}`, formData, {
      headers,
    });
  

  }

}
