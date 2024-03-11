import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { staffRole } from '../models/staffRole';
import { Observable } from 'rxjs';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class RekodKeputusanService {

  baseApiUrl: string = environment.baseApiUrlElims;

  constructor(private http: HttpClient) { }

  GetStaffIdbyStaffRole(staffRole: number): Observable<staffRole[]> {
    return this.http.get<staffRole[]>(this.baseApiUrl + '/api/StaffRoles/GetStaffIdbyStaffRole/' + staffRole);
  }


  PutCheckout(sampleId: number, k1Detail: K1Detail) {
    return this.http.put<string>(this.baseApiUrl + '/api/K1Detail/PutCheckout/' + sampleId, k1Detail);
  }

}
