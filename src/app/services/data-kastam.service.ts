
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
  // k1DetailFound = false;
 k3DetailFound = false;

  constructor(private http: HttpClient) { }
  
  getdataByCustomNo(customNo: string): Observable<K1Header> {
    console.log(customNo)
    return this.http.get<K1Header>(this.baseApiUrl + '/api/K1Header/getdataByCustomNo/' + customNo);
  }

  getK1Detail(customNo: string): Observable<K1Detail[]> {
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K1Detail/getK1Detail/' + customNo);
  }



  getK3DetailbyCustomNo(customNo: string): Observable<K1Detail[]> {
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K3Detail/getK3DetailbyCustomNo/' + customNo);
  }

  getK2DetailbyCustomNo(customNo: string): Observable<K1Detail[]> {
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K2Detail/getK2Detail/' + customNo);
  }


  
  getK1DetailAgentCode(customNo: string, agentCode): Observable<K1Detail[]> {
    // this.k1DetailFound = true
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K1Detail/getK1Detail/' + customNo + '/' + agentCode );
  }


  getK3DetailAgentCode(customNo: string, agentCode): Observable<K1Detail[]> {
    // this.k3DetailFound = true
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K3Detail/getK3Detail/' + customNo + '/' + agentCode );
  }


  getK3DetailImporterCode(customNo: string, importerCode): Observable<K1Detail[]> {
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K3Detail/getK3DetailByImporterCode/' + customNo + '/' + importerCode);
  }
  

  getK2DetailAgentCode(customNo: string, agentCode): Observable<K1Detail[]> {
    // this.k3DetailFound = true
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K2Detail/getK2Detail/' + customNo + '/' + agentCode );
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

  getK3Detail1(id: number): Observable<K1Detail> {
    return this.http.get<K1Detail>(this.baseApiUrl + '/api/K3Detail/getK3Detail1/' + id);
  }

  getK2Detail1(id: number): Observable<K1Detail> {
    return this.http.get<K1Detail>(this.baseApiUrl + '/api/K2Detail/getK2Detail1/' + id);
  }

  getK3HeaderByCustomNo(customNo: string): Observable<K1Header> {
    console.log(customNo)
    return this.http.get<K1Header>(this.baseApiUrl + '/api/K3Header/getK3HeaderByCustomNo/' + customNo);
  }

  
  getK2HeaderByCustomNo(customNo: string): Observable<K1Header> {
    console.log(customNo)
    return this.http.get<K1Header>(this.baseApiUrl + '/api/K2Header/getK2HeaderByCustomNo/' + customNo);
  }


}
