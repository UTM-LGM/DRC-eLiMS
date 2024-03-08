import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { K1Header } from '../models/k1Header';
import { Observable } from 'rxjs';
import { K1Detail } from '../models/k1Detail';
import { StationCode } from '../models/stationCode';
import { CompanyForwarder } from '../models/companyForwarder';
import { Company } from '../models/company';
import { Forwarder } from '../models/forwarder';
import { TypeCode } from '../models/typeCode';

@Injectable({
  providedIn: 'root'
})
export class DaftarSampelService {

  baseApiUrl: string = environment.baseApiUrlElims;
  // baseApiUrl: string = environment.baseApiUrlElimsLocal;

  constructor(private http: HttpClient) { }

  // K1Header

  PostK1HeaderSample(k1Header: K1Header, statusCodeId: number): Observable<K1Header> {
    k1Header.statusCodeId = statusCodeId;
    return this.http.post<K1Header>(this.baseApiUrl + '/api/K1Header/PostK1HeaderSample', k1Header);
  }

  PutK1HeaderSample(updateSampleRequest: K1Header): Observable<K1Header> {
    var body = JSON.stringify(updateSampleRequest)
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    return this.http.put<K1Header>(this.baseApiUrl + '/api/K1Header/PutK1HeaderSample/', body, httpOptions);
  }

  GetK1HeaderByCustomNo(customNo: string): Observable<K1Header> {
    console.log(customNo)
    return this.http.get<K1Header>(this.baseApiUrl + '/api/K1Header/GetK1HeaderByCustomNo/' + customNo);
  }

  // k1Detail

  PostK1DetailSample(k1Detail: K1Detail, statusCodeId: number): Observable<K1Detail> {
    k1Detail.statusCodeId = statusCodeId;
    return this.http.post<K1Detail>(this.baseApiUrl + '/api/K1Detail/PostK1DetailSample', k1Detail);
  }

  PostFileK1Detail(k1DetailId: any, file: any) {
    const formData = new FormData();
    formData.append("file", file);
    console.log(k1DetailId)
    return this.http.post(this.baseApiUrl + '/api/k1Detail/UploadFile/' + k1DetailId, formData);
  }

  GetK1DetailByCustomNo(customNo: string): Observable<K1Detail[]> {
    console.log(customNo)
    return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/K1Detail/GetK1DetailByCustomNo/' + customNo);
  }

  DeleteElimsSample(sampleId: number): Observable<K1Detail> {
    return this.http.delete<K1Detail>(this.baseApiUrl + '/api/K1Detail/DeleteElimsSample/' + sampleId);
  }

  GetElimsSample(sampleId: number): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/K1Detail/GetElimsSample/' + sampleId);
  }

  PutK1DetailSample(sampleId: number, updateSampleRequest: K1Detail): Observable<K1Detail> {
    // console.log(updateSampleRequest)
    return this.http.put<K1Detail>(this.baseApiUrl + '/api/K1Detail/PutK1DetailSample/' + sampleId, updateSampleRequest);
  }

  GetStationCodes() {
    return this.http.get<StationCode>(this.baseApiUrl + '/api/StationCodes/GetStationCodes');
  }

  // getDataByCustomNoAndAgentCode(customNo: string, agentCode: string): Observable<K1Header> {
  //   console.log(customNo)
  //   console.log(agentCode)
  //   return this.http.get<K1Header>(this.baseApiUrl + '/api/K1Header/getDataByCustomNoAndAgentCode/' + customNo + agentCode);
  // }


  getDataByCustomNoAndAgentCode(customNo: string, agentCode: string): Observable<K1Detail[]> {
    const apiUrl = `${this.baseApiUrl}/api/K1Header/${customNo}/${agentCode}`;
    return this.http.get<any>(apiUrl);
  }


  GetCompanyForwarderbyId(forwarderId: number): Observable<Company> {
    console.log(forwarderId)
    return this.http.get<Company>(this.baseApiUrl + '/api/CompanyForwarders/GetCompanyForwarderbyId/' + forwarderId);
  }

  GetForwarderbyCompanyId(companyId: number): Observable<Forwarder> {
    console.log(companyId)
    return this.http.get<Forwarder>(this.baseApiUrl + '/api/CompanyForwarders/GetForwarderbyCompanyId/' + companyId);
  }

  GetCompanyId(companyId: number): Observable<Company> {
    console.log(companyId)
    return this.http.get<Company>(this.baseApiUrl + '/api/Companies/GetCompanyId/' + companyId);
  }
  

  GetForwarders() {
    return this.http.get<Forwarder>(this.baseApiUrl + '/api/Forwarders/GetForwarders');
  }


  GetOldSystemIdbyId(id: number): Observable<TypeCode> {
    console.log(id)
    return this.http.get<TypeCode>(this.baseApiUrl + '/api/TypeCodes/GetOldSystemIdbyId/' + id);
  }
  

}
