import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { K1Detail } from '../models/k1Detail';
import { Batch } from '../models/batch';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CetakKeputusanService {

  baseApiUrl: string = environment.baseApiUrlElims;
  constructor(private http: HttpClient) { }

  PutApproved(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutApproved/' + sampleId, k1Detail);
  }

  PutCetakKeputusan(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutCetakKeputusan/' + sampleId, k1Detail);
  }

  PutWorksheetTestOn(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutWorksheetTestOn/' + sampleId, k1Detail);
  }


  PutPrintResult(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutPrintResult/' + sampleId, k1Detail);
  }

  PutResultLetterApprovedBy(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutResultLetterApprovedBy/' + sampleId, k1Detail);
  }

  // PutResultDate(batch: Batch): Observable<Batch> {
  //   return this.http.put<Batch>(this.baseApiUrl + '/api/Batches/PutResultDate', batch);
  // }

  PutResultDate(batch: Batch): Observable<Batch> {
    return this.http.put<Batch>(this.baseApiUrl + '/api/Batches/PutResultDate', batch);
  }

  GetPostResultNull(resultSentBy: string) {
    return this.http.get(this.baseApiUrl + '/api/Batches/GetPostResultNull/' + resultSentBy);
  }

  GetPostResultNotNull1(resultSentBy: string) {
    return this.http.get(this.baseApiUrl + '/api/Batches/GetPostResultNotNull1/' + resultSentBy);
  }

}
