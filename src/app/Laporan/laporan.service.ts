import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LaporanService {
  baseApiUrl: string = environment.baseApiUrlElims;

  constructor(private http: HttpClient) { }


  GetSampleCount(startDate: Date | undefined, endDate: Date | undefined, rubberTypeId: number | undefined, typeCodeId: number | undefined): Observable<any> {
    let queryString = '';

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        console.error('Invalid start or end date.');
      }
    }

    if (rubberTypeId) {
      queryString += `rubberTypeId=${rubberTypeId}&`;
    }
    if (typeCodeId) {
      queryString += `typeCodeId=${typeCodeId}&`;
    }

    queryString = queryString.replace(/&$/, '');

    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountSamples'}?${queryString}`);
  }


  // Modify the CountSamplesByInLabOn service
  CountSamplesByInLabOn(startDate: Date | undefined, endDate: Date | undefined, tester: string | undefined): Observable<any> {
    let queryString = '';
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        console.error('Invalid start or end date.');
        return throwError('Invalid start or end date.');
      }
    }

    if (tester) {
      queryString += `tester=${tester}&`;
    }

    queryString = queryString.replace(/&$/, '');

    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountSamplesByInLabOn'}?${queryString}`);
  }


  CountLevelEfficiency(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountLevelEfficiency'}?${queryString}`);
  }


  CountLevelEfficiencyLatex(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountLevelEfficiencyLatex'}?${queryString}`);
  }



  CountLevelEfficiencyBlockRubber(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountLevelEfficiencyBlockRubber'}?${queryString}`);
  }



  CountSamplesByTesterName(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountSamplesByTesterName'}?${queryString}`);
  }



  CountSamplesByForwarder(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountSamplesByForwarder'}?${queryString}`);
  }



  CountSamplesByCustomOffice(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountSamplesByCustomOffice'}?${queryString}`);
  }


  GetSampleCountByStatusCode(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/api/K1Detail/GetSampleCountByStatusCode`);
  }



  CountSamplesByApproval(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountSamplesByApproval'}?${queryString}`);
  }



  CountReportKgkSamples(startDate: Date | undefined, endDate: Date | undefined): Observable<any> {
    // Create the query string based on provided parameters
    let queryString = '';
    if (startDate && endDate) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the parsed dates are valid Date objects
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Construct the query string using the parsed dates
        queryString += `startDate=${start.toISOString()}&endDate=${end.toISOString()}&`;
      } else {
        // Handle invalid dates if necessary
        console.error('Invalid start or end date.');
      }
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl + '/api/K1Detail/CountReportKgkSamples'}?${queryString}`);
  }


}

