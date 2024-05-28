import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class KeputusanUjianService {
  baseApiUrl: string = environment.baseApiUrlElims;

  constructor(private http: HttpClient) { }

  PutUlangCetakKeputusanUjian(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutUlangCetakKeputusanUjian/' + sampleId, k1Detail);
  }

}



