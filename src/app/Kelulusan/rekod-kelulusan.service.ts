import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';;
import { Observable } from 'rxjs';
import { Result } from '../models/result';

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
    const body = emailRecipients; // recipients are sent as the body
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(`${this.baseApiUrl}/api/Email/notificationResultLetter/${staffId}/${k1DetailId}`, body);
}



uipNotificationResultLetter(staffId: number, k1DetailId: number, emailRecipients: string[]) {
  const body = emailRecipients; // recipients are sent as the body
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.http.post(`${this.baseApiUrl}/api/Email/uipNotificationResultLetter/${staffId}/${k1DetailId}`, body);
}

  
// uipNotificationResultLetter(staffId: number, batchId: number, emailRecipients: string[]) {
//   const body = emailRecipients; // recipients are sent as the body
//   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
//   return this.http.post(`${this.baseApiUrl}/api/Email/uipNotificationResultLetter/${staffId}/${batchId}`, body);
// }


  GetEmailForwarder(forwarderId: number) {
    return this.http.get<any>(this.baseApiUrl + '/api/Forwarders/GetEmailForwarder/' + forwarderId);
  }

}
