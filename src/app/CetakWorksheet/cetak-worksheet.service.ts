import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { K1Detail } from '../models/k1Detail';
import { Observable } from 'rxjs';
import { Penimbang } from '../models/penimbang';

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

  GetRefLtxPenimbangs(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/RefLtxPenimbangs/GetRefLtxPenimbangs');
  }
  
  GetLtxOvens(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/RefLtxOvens/GetRefLtxOvens');
  }

  GetRefBrPenimbangs(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/RefBrPenimbangs/GetRefBrPenimbangs');
  }

  GetBrOvens(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/RefBrOvens/GetRefBrOvens');
  }


  // PutRefPenimbang(k1DetailId: number, k1Detail: K1Detail) {
  //   return this.http.put<Penimbang>(this.baseApiUrl + '/api/RefPenimbangs/PutRefPenimbang/' + k1DetailId, k1Detail);
  // }


  PutRefEquipment(k1DetailId: number, k1Detail: K1Detail) {
  return this.http.put<K1Detail>(this.baseApiUrl + '/api/K1Detail/PutEquipment/' + k1DetailId, k1Detail);
}

  PutRefOven(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<Penimbang>(this.baseApiUrl + '/api/RefOvens/PutRefOven/' + sampleId, k1Detail);
  }



  PostRefOven(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/RefOvens/PostRefOven/' + sampleId, k1Detail);
  }



  GetRefPenimbangs(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/RefPenimbangs/GetRefPenimbangs');
  }
  
  GetRefOvens(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/api/RefOvens/GetRefOvens');
  }



}
