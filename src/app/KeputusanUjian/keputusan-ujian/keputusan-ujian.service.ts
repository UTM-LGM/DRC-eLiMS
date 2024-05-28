
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeputusanUjianService {

 
  baseApiUrl: string = environment.baseApiUrlElims;
  
  constructor(private http: HttpClient) { }

  GetElimsSearchSample(username: string, queryParams: any): Observable<any[]> {
    let apiUrl = this.baseApiUrl + '/api/K1Detail/GetElimsSearchSample/' + username;
  
    const queryString = Object.keys(queryParams)
      .filter((key) => queryParams[key] !== undefined)
      .map((key) => {
        if (key === 'fromDate' || key === 'toDate') {
          return key + '=' + new Date(queryParams[key]).toISOString();
        }
        return key + '=' + queryParams[key];
      })
      .join('&');
  
    if (queryString) {
      apiUrl += '?' + queryString;
    }
  
    return this.http.get<any[]>(apiUrl);
  }
  


  GetElimsSearchSamples(queryParams: any): Observable<any[]> {
    let apiUrl = this.baseApiUrl + '/api/K1Detail/GetElimsSearchSamples/';
  
    const queryString = Object.keys(queryParams)
      .filter((key) => queryParams[key] !== undefined)
      .map((key) => {
        if (key === 'fromDate' || key === 'toDate') {
          return key + '=' + new Date(queryParams[key]).toISOString();
        }
        return key + '=' + queryParams[key];
      })
      .join('&');
  
    if (queryString) {
      apiUrl += '?' + queryString;
    }
  
    return this.http.get<any[]>(apiUrl);
  }
  
  
  
}
