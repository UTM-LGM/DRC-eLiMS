import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Sample } from '../models/sample';
import { Observable } from 'rxjs';
import { Batch } from '../models/batch';

@Injectable({
  providedIn: 'root'
})

export class DrclimstrainingService {

  statusCodeId: any
  RequestModel: any
  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  PostLtxSamples(sample: Sample, statusCodeId: number): Observable<Sample> {
    sample.statusCodeId = statusCodeId;
    return this.http.post<Sample>(this.baseApiUrl + '/api/LtxSamples/PostLtxSamples', sample);
  }

  PostLtxBatches(batchId2: number, batch: Batch, username: string): Observable<Batch> {
    batch.batchIdNew = batchId2
    batch.sentBy = username
    return this.http.post<Batch>(this.baseApiUrl + '/api/LtxBatches/PostLtxBatches/', batch);
  }

  PutLtxSampleBatchId(sampleId: number, sample: Sample): Observable<Sample> {
    // PutLtxSampleBatchId(sampleId: number, sample:Sample){
    console.log(sample)
    return this.http.put<Sample>(this.baseApiUrl + '/api/LtxSamples/PutLtxSampleBatchId/' + sampleId, sample);
  }

  PutLtxSample(sampleId: number, updateSampleRequest: Sample): Observable<Sample> {
    console.log(sampleId)
    return this.http.put<Sample>(this.baseApiUrl + '/api/LtxSamples/PutLtxSample/' + sampleId, updateSampleRequest);
  }

  DeleteLtxSample(sampleId: number): Observable<Sample> {
    return this.http.delete<Sample>(this.baseApiUrl + '/api/LtxSamples/DeleteLtxSample/' + sampleId);
  }

  PutLtxLabelTelahDicetak(sampleId: number, cetakSample: Sample) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<string>(this.baseApiUrl + '/api/LtxSamples/PutLtxLabelTelahDicetak/' + sampleId, cetakSample);
  }

  PutLtxTarikhSampelDihantar(batch: Batch): Observable<Batch> {
    return this.http.post<Batch>(this.baseApiUrl + '/api/LtxBatches/PutLtxTarikhSampelDihantar', batch);
  }

  PutLtxTarikhSampelDihantarUip(batch: Batch): Observable<Batch> {
    return this.http.put<Batch>(this.baseApiUrl + '/api/LtxBatches/PutLtxTarikhSampelDihantarUip', batch);
  }


}
