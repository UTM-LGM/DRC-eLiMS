import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class CetakWorksheetService {

  baseApiUrl: string = environment.baseApiUrlElims;
  
  constructor(private http: HttpClient) { }

  PutCetakLembaranKerja(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutCetakLembaranKerja/' + sampleId, k1Detail);
  }


}
