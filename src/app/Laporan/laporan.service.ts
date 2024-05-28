import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { K1Detail } from '../models/k1Detail';

@Injectable({
  providedIn: 'root'
})
export class LaporanService {
  baseApiUrl: string = environment.baseApiUrlElims;

  constructor(private http: HttpClient) { }


  // GetSampleCountByStatusCode(selectedDate: string) {
  //   return this.http.get<any>(this.baseApiUrl + '/api/K1Detail/GetSampleCountByStatusCode');
  // }

  GetSampleCount(startDate: Date | undefined, endDate: Date | undefined, rubberTypeId: number | undefined, typeCodeId: number | undefined): Observable<any> {
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
  
    if (rubberTypeId) {
      queryString += `rubberTypeId=${rubberTypeId}&`;
    }
    if (typeCodeId) {
      queryString += `typeCodeId=${typeCodeId}&`;
    }

    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountSamples' }?${queryString}`);
  }



  CountSamplesByInLabOn(startDate: Date | undefined, endDate: Date | undefined, inLabBy: string ): Observable<any> {
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
  
    if (inLabBy) {
      queryString += `inlabby=${inLabBy}&`;
    }


    // Remove the trailing '&' if present
    queryString = queryString.replace(/&$/, '');

    // Call the API with the constructed query string
    return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountSamplesByInLabOn' }?${queryString}`);
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
    return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountLevelEfficiency' }?${queryString}`);
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
    return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountSamplesByTesterName' }?${queryString}`);
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
    return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountSamplesByForwarder' }?${queryString}`);
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
    return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountSamplesByCustomOffice' }?${queryString}`);
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
  return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountSamplesByApproval' }?${queryString}`);
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
  return this.http.get<any>(`${this.baseApiUrl +'/api/K1Detail/CountReportKgkSamples' }?${queryString}`);
}


}

