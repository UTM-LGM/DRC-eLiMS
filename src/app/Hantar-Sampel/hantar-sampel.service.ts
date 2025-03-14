import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { UipSampleRunNo } from '../models/uipSampleRunNo';
import { Observable } from 'rxjs';
import { UipbkhSampleRunNo } from '../models/uipbkhSampleRunNo';
import { K1Detail } from '../models/k1Detail';
import { UipMemoRunNo } from '../models/uipMemoRunNo';
import { Batch } from '../models/batch';
import { UipbkhMemoRunNo } from '../models/uipbkhMemoRunNo';
import { Sample } from '../models/sample';
import { LabRefNo } from '../models/labRefNo';

@Injectable({
  providedIn: 'root'
})
export class HantarSampelService {
  GetCurrentRunNo(thisyear: string) {
    throw new Error('Method not implemented.');
  }
  PostSampleRunNo(unitPrefix: string, thisyear: string) {
    throw new Error('Method not implemented.');
  }

  baseApiUrl: string = environment.baseApiUrlElims;
  // baseApiUrlElimsLocal: string = environment.baseApiUrlElimsLocal;
  // baseApiUrl: string = environment.baseApiUrlElimsOffline;

  constructor(private http: HttpClient) { }

  // UipSampleRunNoes

  PutUipSampleRunNo(year: string): Observable<UipSampleRunNo> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<UipSampleRunNo>(this.baseApiUrl + '/api/UipSampleRunNoes/PutUipSampleRunNo/' + year, httpOptions);
  }

  PutLabRefNo(monthyear: string, sample: Sample) {
    return this.http.put<LabRefNo>(this.baseApiUrl + '/api/LabRefNoRunningNoes/PutLabRefNo/' + monthyear, sample);
  }

  PutMemoPrinted(batchid: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put(this.baseApiUrl + '/api/Batches/PutMemoPrinted/' + batchid, httpOptions);
  }

  // UipbkhSampleRunNoes

  PutUipbkhSampleRunNo(year: string): Observable<UipbkhSampleRunNo> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<UipbkhSampleRunNo>(this.baseApiUrl + '/api/UipbkhSampleRunNoes/PutUipbkhSampleRunNo/' + year, httpOptions);
  }

  // UipMemoRunNoes

  PutUipMemoRunNo(year: string): Observable<UipMemoRunNo> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<UipMemoRunNo>(this.baseApiUrl + '/api/UipMemoRunNoes/PutUipMemoRunNo/' + year, httpOptions);
  }

  // UipbkhMemoRunNoes

  PutUipbkhMemoRunNo(year: string): Observable<UipbkhMemoRunNo> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<UipbkhMemoRunNo>(this.baseApiUrl + '/api/UipbkhMemoRunNoes/PutUipbkhMemoRunNo/' + year, httpOptions);
  }

  // Batches

  PostElimsBatches(batch: Batch, username: string): Observable<Batch> {
    batch.sentBy = username
    return this.http.post<Batch>(this.baseApiUrl + '/api/Batches/PostElimsBatches', batch);
  }

  GetBatchByBatchId(batchId: number): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/api/Batches/GetBatchByBatchId/${batchId}`);
  }


  PutBatchUipRefRunNo(batchId2: number, batch: Batch): Observable<Batch> {
    batch.batchId = batchId2
    console.log(batch)
    return this.http.put<Batch>(this.baseApiUrl + '/api/Batches/PutBatchUipRefRunNo/', batch);
  }


  PostTarikhSampelDihantar(UipRegNo: Batch): Observable<Batch> {
    return this.http.put<Batch>(this.baseApiUrl + '/api/Batches/PostTarikhSampelDihantar', UipRegNo);
  }

  PostUipTarikhSampelDihantar(batch: Batch): Observable<Batch> {
    return this.http.put<Batch>(this.baseApiUrl + '/api/Batches/PostUipTarikhSampelDihantar', batch);
  }


  UploadReceipt(batchId: any, file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(this.baseApiUrl + '/api/Batches/UploadReceipt/' + batchId, formData);
  }

  // k1Details


  PutElimsSampleBatchId(sampleId: number, k1Detail: K1Detail): Observable<K1Detail> {
    return this.http.put<K1Detail>(this.baseApiUrl + '/api/K1Detail/PutElimsSampleBatchId/' + sampleId, k1Detail);
  }

  PutSampleUipbkhRefRunNo(k1DetailId: number, k1Detail: K1Detail): Observable<K1Detail> {
    k1Detail.k1DetailId = k1DetailId
    console.log(k1Detail)
    return this.http.put<K1Detail>(this.baseApiUrl + '/api/k1Detail/PutSampleUipbkhRefRunNo/', k1Detail);
  }


  notificationMemo(staffId: number, batchId: number, emailRecipient: string[]) {
    const body = { emailRecipient };
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.post(this.baseApiUrl + '/api/Email/notificationMemo/' + staffId + '/' + batchId, emailRecipient, httpOptions);
  }


  getEmailStaff(staffId: number) {
    return this.http.get(this.baseApiUrl + '/api/Staffs/GetEmailStaff/' + staffId);
  }


  GetElimsBatchBySendByNull1(sentBy: string) {
    return this.http.get(this.baseApiUrl + '/api/Batches/GetElimsBatchBySendByNull1/' + sentBy);
  }


  GetElimsBatchBySendByNotNull(sentBy: string) {
    return this.http.get(this.baseApiUrl + '/api/Batches/GetElimsBatchBySendByNotNull/' + sentBy);
  }


  PutBatchPrinted(batchId: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<string>(this.baseApiUrl + '/api/Batches/PutBatchPrinted/' + batchId, httpOptions);
  }

}
