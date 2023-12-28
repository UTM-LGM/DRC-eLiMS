import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Sample } from '../models/sample';
import { BankCode } from '../models/bankCode';
import { Batch } from '../models/batch';
import { Country } from '../models/country';
import { Company } from '../models/company';
import { Forwarder } from '../models/forwarder';
import { Staff } from '../models/staff';
import { SampleType } from '../models/sampleType';
import { RubberType } from '../models/rubberType';
import { UipbkhRefRunNo } from '../models/uipbkhRefRunNo';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class ElimsService {

  statusCodeId: number
  baseApiUrl: string = environment.baseApiUrlElims;

  constructor(private http: HttpClient) { }


  GetAllCountries(): Observable<Country> {
    return this.http.get<Country>(this.baseApiUrl + '/api/Countries/GetAllCountries/');
  }


  GetRefRubberTypes(): Observable<RubberType[]> {
    return this.http.get<RubberType[]>(this.baseApiUrl + '/api/RefRubberTypes/GetRefRubberTypes');
  }


  GetAllCompanies(): Observable<Company> {
    return this.http.get<Company>(this.baseApiUrl + '/api/Companies/GetAllCompanies');
  }


  GetRefSampleTypeByRubberType(rubberTypeId: number): Observable<SampleType> {
    return this.http.get<SampleType>(this.baseApiUrl + '/api/RefSampleTypes/GetRefSampleTypeByRubberType/' + rubberTypeId);
  }


  GetCompanies(forwarderId: number) {
    return this.http.get<Company>(this.baseApiUrl + '/api/Companies/GetCompanies/' + forwarderId);
  }

  GetElimsBankCodes() {
    return this.http.get<BankCode>(this.baseApiUrl + '/api/BankCodes/GetElimsBankCodes');
  }


  GetElimsSamplesByUsername(username: String, statusCodeId: number): Observable<Sample[]> {
    // console.log(statusCodeId)
    const params = new HttpParams().set('statusCodeId', statusCodeId).set('username', username.toString());
    return this.http.get<Sample[]>(this.baseApiUrl + '/api/K1Detail/GetElimsSamplesByUsername', { params });
  }

  PutForwarderProfile(forwarderId: number, updateProfileRequest: Forwarder): Observable<Staff> {
    return this.http.put<any>(this.baseApiUrl + '/api/Forwarders/PutForwarderProfile/' + forwarderId, updateProfileRequest);
  }


  

//test
getElimsSample(sampleId: number): Observable<any> {
  return this.http.get<any>(this.baseApiUrl + '/api/K1Detail/getElimsSample/' + sampleId);
}















  // getElimsSampleByStatus(statusCodeId: number = 1):Observable<Sample[]> {
  //   const params = new HttpParams().set('statusCodeId', statusCodeId.toString());
  //   return this.http.get<Sample[]>(this.baseApiUrl + '/api/K1Detail/getElimsSampleByStatus', { params });
  // }


  getElimsSamplesByUsername2(username: String, statusCodeId: number): Observable<Sample[]> {
    const params = new HttpParams().set('statusCodeId', statusCodeId.toString()).set('username', username.toString());
    return this.http.get<Sample[]>(this.baseApiUrl + '/api/K1Detail/GetElimsSamplesByUsername', { params });
  }

  getElimsSamplesByUsername3(username: String, statusCodeId: number): Observable<Sample[]> {
    const params = new HttpParams().set('statusCodeId', statusCodeId.toString()).set('username', username.toString());
    return this.http.get<Sample[]>(this.baseApiUrl + '/api/K1Detail/GetElimsSamplesByUsername', { params });
  }
  

  // deleteElimsSampleHeader(sampleId: number) {
  //   return this.http.delete(this.baseApiUrl + '/api/K1Header/deleteElimsSampleHeader/' + sampleId);
  // } 

  GetElimsAllBatch() {
    return this.http.get<Batch[]>(this.baseApiUrl + '/api/Batches/GetElimsAllBatch');
  }

  getTarikhSampelDihantar() {
    return this.http.get<Batch[]>(this.baseApiUrl + '/api/ElimsBatches/getTarikhSampelDihantar');
  }
  updateSampleElims(sampleId: number, updateSampleRequest: Sample): Observable<Sample> {
    return this.http.put<Sample>(this.baseApiUrl + '/api/LtxSamples/updateSampleElims/' + sampleId, updateSampleRequest);
  }


  // getElimsSampleByK1HeaderId(k1HeaderId: number): Observable<K1Detail[]> {
  //   return this.http.get<K1Detail[]>(this.baseApiUrl + '/api/k1Detail/getElimsSampleByK1HeaderId/' + k1HeaderId);
  // }

  GetForwarders(): Observable < Forwarder[] > {
    return this.http.get<Forwarder[]>(this.baseApiUrl + '/api/Forwarders/GetForwarders');
  }


  updateStaffProfile(staffId: number, updateProfileRequest: Staff): Observable<Staff> {
    // console.log(updateSampleRequest)
    return this.http.put<Staff>(this.baseApiUrl + '/api/Staffs/updateProfile/' + staffId, updateProfileRequest);
  }

  GetUipbkhByRefRunNo(runNo: number) {
    return this.http.get<UipbkhRefRunNo>(this.baseApiUrl + '/api/UipbkhRefRunNoes/GetUipbkhByRefRunNo/' + runNo)

  }


  GetElimsSamplesByBatchId(batchId: number) {
    return this.http.get<Sample[]>(this.baseApiUrl + '/api/K1Detail/GetElimsSamplesByBatchId/' + batchId)

  }

}
