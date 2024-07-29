import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Sample } from '../models/sample';
import { Batch } from '../models/batch';


@Injectable({
  providedIn: 'root'
})
export class GetahBongkahService {

  // baseApiUrl: string = environment.baseApiUrlBR;
  // constructor(private http: HttpClient) { }


  // PutBRLabelTelahDicetak(sampleId: number, cetakSample: Sample) {
  //   return this.http.put<string>(this.baseApiUrl + '/api/BRSamples/PutBRLabelTelahDicetak/' + sampleId, cetakSample);
  // }

  // PostBRSamples(sample: Sample, statusCodeId: number): Observable<Sample> {
  //   sample.statusCodeId = statusCodeId;
  //   // sample.typeCodeId = 3;
  //   return this.http.post<Sample>(this.baseApiUrl + '/api/BRSamples/PostBRSamples', sample);
  // }

  // PostBRBatches(batchId2:number,batch: Batch,username:string): Observable<Batch> {
  //   batch.batchIdNew = batchId2
  //   batch.sentBy = username
  //   return this.http.post<Batch>(this.baseApiUrl + '/api/BRBatches/PostBRBatches/', batch);
  // }


  // PostElimsBatches(batch: Batch, username: string): Observable<Batch> {
  //   // var body = JSON.stringify(batch)
  //   batch.sentBy = username
  //   return this.http.post<Batch>(this.baseApiUrl + '/api/Batches/PostElimsBatches', batch);
  // }



  // PutBRSample(sampleId: number, updateSampleRequest: Sample): Observable<Sample> {
  //   console.log(sampleId)
  //   console.log(updateSampleRequest)

  //   return this.http.put<Sample>(this.baseApiUrl + '/api/BRSamples/PutBRSample/' + sampleId, updateSampleRequest);
  // }

  // DeleteBRSample(sampleId: number): Observable<Sample> {
  //   return this.http.delete<Sample>(this.baseApiUrl + '/api/BRSamples/DeleteBRSample/' + sampleId);
  // }


  // PutBRSampleBatchId(sampleId: number, sample:Sample): Observable<Sample> {
  //   return this.http.put<Sample>(this.baseApiUrl + '/api/BRSamples/PutBRSampleBatchId/' + sampleId, sample);
  // }


  // PutBRTarikhSampelDihantar(batch: Batch): Observable<Batch> {
  //   return this.http.post<Batch>(this.baseApiUrl + '/api/BRBatches/PutBRTarikhSampelDihantar', batch);
  // }


}
