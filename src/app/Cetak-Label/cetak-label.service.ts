import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class CetakLabelService {

  baseApiUrl: string = environment.baseApiUrlElims;

  constructor(private http: HttpClient) { }

  Putk1DetailLabelTelahDicetak(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/Putk1DetailLabelTelahDicetak/' + sampleId, k1Detail);
  }

  Putk1HeaderLabelTelahDicetak(sampleId: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/Putk1HeaderLabelTelahDicetak/' + sampleId, httpOptions);
  }

}
