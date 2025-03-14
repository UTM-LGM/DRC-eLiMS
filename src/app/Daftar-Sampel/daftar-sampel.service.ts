import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { K1Header } from '../models/k1Header';
import { Observable } from 'rxjs';
import { K1Detail } from '../models/k1Detail';
import { StationCode } from '../models/stationCode';
import { Company } from '../models/company';
import { Forwarder } from '../models/forwarder';

@Injectable({
  providedIn: 'root'
})
export class DaftarSampelService {

  baseApiUrl: string = environment.baseApiUrlElims;
  // baseApiUrl: string = environment.baseApiUrlElimsLocal;

  constructor(private http: HttpClient) { }
  private selectedK1DetailId: number;

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

  // k1Detail

  setSelectedK1DetailId(k1DetailId: number) {
    this.selectedK1DetailId = k1DetailId;
  }

  getSelectedK1DetailId(): number {
    return this.selectedK1DetailId;
  }

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

  GetCompanyForwarderbyId(forwarderId: number): Observable<Company> {
    console.log(forwarderId)
    return this.http.get<Company>(this.baseApiUrl + '/api/CompanyForwarders/GetCompanyForwarderbyId/' + forwarderId);
  }

  GetForwarders() {
    return this.http.get<Forwarder>(this.baseApiUrl + '/api/Forwarders/GetForwarders');
  }

  PutDateReceivedInLab(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutDateReceivedInLab/' + sampleId, k1Detail);
  }


  getLateSamples(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<any>(`${this.baseApiUrl}/api/K1Detail/GetAllLateSamples`, { params });
  }
  

}
