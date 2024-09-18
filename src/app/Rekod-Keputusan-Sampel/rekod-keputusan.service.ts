import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { staffRole } from '../models/staffRole';
import { Observable } from 'rxjs';
import { K1Detail } from '../models/k1Detail';
import { Sample } from '../models/sample';
import { Result } from '../models/result';
import { Retest } from '../models/retest';

@Injectable({
  providedIn: 'root'
})
export class RekodKeputusanService {

  baseApiUrl: string = environment.baseApiUrlElims;
  offline: string = environment.baseApiUrlElimsLocal;

  constructor(private http: HttpClient) { }

  GetStaffIdbyStaffRole(staffRole: number): Observable<staffRole[]> {
    return this.http.get<staffRole[]>(this.baseApiUrl + '/api/StaffRoles/GetStaffIdbyStaffRole/' + staffRole);
  }


  
  GetStaffIdbyStaffRoleIkmNo(staffRole: number): Observable<staffRole[]> {
    return this.http.get<staffRole[]>(this.baseApiUrl + '/api/StaffRoles/GetStaffIdbyStaffRoleIkmNo/' + staffRole);
  }

  PutCheckout(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutCheckout/' + sampleId, k1Detail);
  }

  PutResult(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutResult/' + sampleId, k1Detail);
  }

  PutVerifiedResult(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutVerifiedResult/' + sampleId, k1Detail);
  }

  PutRetest(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<K1Detail>(this.baseApiUrl + '/api/K1Detail/PutRetest/' + sampleId, k1Detail);
  }

  GetResultsByCustomNo(customNo: string, statusCodeId:number) {
    return this.http.get<Sample[]>(this.baseApiUrl + '/api/K1Detail/GetResultsByCustomNo/' + customNo +'/' + statusCodeId)

  }

  PostResult(result: Result): Observable<Result> {
    var body = JSON.stringify(result); 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Result>(this.baseApiUrl + '/api/Results/PostResult', body,{headers});
  }


  // PostResult(result: Result): Observable<Result> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post<Result>(`${this.baseApiUrl}/api/Results/PostResult`, result, { headers });
  // }

  
  PutResultbyK1DetailId(result: Result): Observable<Result> {
    return this.http.put<Result>(this.baseApiUrl + '/api/Results/PutResultbyK1DetailId/' + result.k1DetailId,  result);
  }

 ResetResult(result: Result): Observable<Result> {
    return this.http.put<Result>(this.baseApiUrl + '/api/Results/ResetResult/' + result.k1DetailId,  result);
  }


  // PutK1HeaderSample(updateSampleRequest: K1Header): Observable<K1Header> {
  //   var body = JSON.stringify(updateSampleRequest)
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //   return this.http.put<K1Header>(this.baseApiUrl + '/api/K1Header/PutK1HeaderSample/', body, httpOptions);
  // }



  PostRetest(retest: Retest): Observable<Retest> {
    console.log(retest)
    return this.http.post<Retest>(this.baseApiUrl + '/api/Retests/PostRetest', retest);
  }

  PostProve(k1DetailId: any, file: any) {
    const formData = new FormData();
    formData.append("file", file);
    console.log(k1DetailId)
    return this.http.post(this.baseApiUrl + '/api/Results/UploadProve/' + k1DetailId, formData);
  }



}
