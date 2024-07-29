
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { K1Header } from '../models/k1Header';
import { environment } from '../environments/environment';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class DataKastamService {

  baseApiUrl: string = environment.baseApiUrlDK23;

  constructor(private http: HttpClient) { }
  
  getdataByCustomNo(customNo: string): Observable<K1Header> {
    console.log(customNo)
    return this.http.get<K1Header>(this.baseApiUrl + '/api/K1Header/getdataByCustomNo/' + customNo);
  }

  getK1Detail(customNo: string): Observable<K1Detail[]> {
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K1Detail/getK1Detail/' + customNo);
  }
  
  getK1DetailAgentCode(customNo: string, agentCode): Observable<K1Detail[]> {
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K1Detail/getK1Detail/' + customNo + '/' + agentCode );
  }

  getK1DetailByImporterCode(customNo: string, importerCode): Observable<K1Detail[]> {
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K1Detail/getK1DetailByImporterCode/' + customNo + '/' + importerCode);
  }

  getK1Detail2(customNo: string, agentCode: string): Observable<any> {
    const url = `${this.baseApiUrl}/api/K1Detail/getK1Detail/${customNo}/${agentCode}`;
    return this.http.get<any>(url);
  }

  getK1Detail1(id: number): Observable<K1Detail> {
    return this.http.get<K1Detail>(this.baseApiUrl + '/api/K1Detail/getK1Detail1/' + id);
  }

}
