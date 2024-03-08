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
import { TestMethod } from '../models/testMethod';
import { TypeCode } from '../models/typeCode';
import { loginForwarder } from '../models/loginForwarder';
import { loginImporter } from '../models/loginImporters';

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


  // GetRefSampleTypeByRubberType(rubberTypeId: number): Observable<SampleType> {
  //   return this.http.get<SampleType>(this.baseApiUrl + '/api/RefSampleTypes/GetRefSampleTypeByRubberType/' + rubberTypeId);
  // }

  GetRefSampleTypeByRubberType(rubberTypeId: number): Observable<TypeCode[]> {
    return this.http.get<TypeCode[]>(this.baseApiUrl + '/api/TypeCodes/GetRefSampleTypeByRubberType/' + rubberTypeId);
  }

  GetCompanies(forwarderId: number) {
    return this.http.get<Company>(this.baseApiUrl + '/api/Companies/GetCompanies/' + forwarderId);
  }
 
  GetCompaniesbySMKImportersCode(smkImportersCode: string) {
    return this.http.get<Company>(this.baseApiUrl + '/api/Companies/GetCompaniesbySMKImportersCode/' + smkImportersCode);
  }

  GetForwardersbySMKImportersCode(smkImportersCode: string) {
    return this.http.get<Forwarder>(this.baseApiUrl + '/api/Companies/GetForwardersbySMKImportersCode/' + smkImportersCode);
  }


  GetElimsBankCodes() {
    return this.http.get<BankCode>(this.baseApiUrl + '/api/BankCodes/GetElimsBankCodes');
  }

  GetKeteranganByKodStesen(kodStesen:string){
    return this.http.get(this.baseApiUrl + '/api/StationCodes/GetKeteranganByKodStesen/'+kodStesen);
    
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



GetRefTestMethodByRubberType(rubberTypeId: number): Observable<TestMethod> {
  return this.http.get<TestMethod>(this.baseApiUrl + '/api/RefTestMethods/GetRefTestMethodByRubberType/' + rubberTypeId);
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


  GetBatchCetakWorksheet() {
    return this.http.get<Batch[]>(this.baseApiUrl + '/api/Batches/GetBatchCetakWorksheet');
  }

  GetElimsAllBatch(statusCodeId:number) {
    return this.http.get<Batch[]>(this.baseApiUrl + '/api/Batches/GetElimsAllBatch/'+ statusCodeId);
  }

  // GetElimsAllBatch(statusCodeId: number, k1Detail: K1Detail): Observable<Batch[]> {
  //   const params = new HttpParams().set('statusCodeId', statusCodeId.toString()); // Convert statusCodeId to string
  //   return this.http.get<Batch[]>(`${this.baseApiUrl}/api/Batch/GetElimsAllBatch`, { params });
  // }
  


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

  PutCompanyProfile(companyId: number, updateProfileRequest: loginImporter): Observable<loginImporter> {
    return this.http.put<loginImporter>(this.baseApiUrl + '/api/Companies/PutCompanyProfile/' + companyId, updateProfileRequest);
  }

  GetUipbkhByRefRunNo(runNo: number) {
    return this.http.get<UipbkhRefRunNo>(this.baseApiUrl + '/api/UipbkhRefRunNoes/GetUipbkhByRefRunNo/' + runNo)
  }


  GetElimsSamplesByBatchId(batchId: number) {
    return this.http.get<Sample[]>(this.baseApiUrl + '/api/K1Detail/GetElimsSamplesByBatchId/' + batchId)

  }

  GetSamplesByBatchId(batchId: number) {
    return this.http.get<any>(this.baseApiUrl + '/api/Batches/GetSamplesByBatchId/' + batchId)

  }


  // PutDaftarTerimaSampel(sampleId: number, k1Detail: K1Detail) {
  //   return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutDaftarTerimaSampel/' + sampleId, k1Detail);
  // }

 
  PutSampleLabRefNo(k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutSampleLabRefNo', k1Detail);
  }

  
  PutDaftarTerimaSampelLabRef(customNo: string, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutDaftarTerimaSampelLabRef/' + customNo, k1Detail);
  }

  PutDaftarTerimaSampel(customNo: string, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutDaftarTerimaSampel/' + customNo, k1Detail);
  }

 
  // GetElimsBatchesWithSamplesStatusCode6(username: String, statusCodeId: number): Observable<Batch[]> {
  //   // console.log(statusCodeId)
  //   const params = new HttpParams().set('statusCodeId', statusCodeId).set('username', username.toString());
  //   return this.http.get<Batch[]>(this.baseApiUrl + '/api/Batches/GetElimsBatchesWithSamplesStatusCode6', { params });
  // }


  // GetElimsBatchesWithSamplesStatusCode6() {
  //   return this.http.get<Batch[]>(this.baseApiUrl + '/api/Batches/GetBatchesWithSamplesStatusCode6/withSamplesStatusCode6');
  // }



  
}
