import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { K1Detail } from '../models/k1Detail';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CetakWorksheetService {

  baseApiUrl: string = environment.baseApiUrlElims;
  baseApiOffline: string = environment.baseApiUrlElimsLocal;
  
  constructor(private http: HttpClient) { }

  PutCetakLembaranKerja(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutCetakLembaranKerja/' + sampleId, k1Detail);
  }

  PutWorksheetTestOn(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutWorksheetTestOn/' + sampleId, k1Detail);
  }


  PutUlangCetakLembaranKerja(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutUlangCetakLembaranKerja/' + sampleId, k1Detail);
  }


  GetElimsSample(k1DetailId: number): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/K1Detail/GetElimsSample/' + k1DetailId);
  }
  

  PutPrintResult(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutPrintResult/' + sampleId, k1Detail);
  }

  
}
