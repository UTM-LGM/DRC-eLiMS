import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';;
import { Observable } from 'rxjs';
import { Result } from '../models/result';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class RekodKelulusanService {

  baseApiUrl: string = environment.baseApiUrlElims;
  
  constructor(private http: HttpClient) { }


  GetResultbySampleId(k1DetailId: number): Observable<Result> {
    return this.http.get<Result>(this.baseApiUrl + '/api/Results/GetResultbySampleId/' + k1DetailId);
  }

 notificationResultLetter(staffId: number, k1DetailId: number, emailRecipients: string[]) {
    const body = emailRecipients; 
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(`${this.baseApiUrl}/api/Email/notificationResultLetter/${staffId}/${k1DetailId}`, body);
}


uipNotificationResultLetter(staffId: number, k1DetailId: number, emailRecipients: string[]) {
  const body = emailRecipients; 
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.http.post(`${this.baseApiUrl}/api/Email/uipNotificationResultLetter/${staffId}/${k1DetailId}`, body);
}


  GetEmailForwarder(forwarderId: number) {
    return this.http.get<any>(this.baseApiUrl + '/api/Forwarders/GetEmailForwarder/' + forwarderId);
  }


  PutRetestApproval(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutRetestApproval/' + sampleId, k1Detail);
  }


}
