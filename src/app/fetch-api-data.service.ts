/**
 * I generated this file and fetch-api-data.service.spec.ts by running
 * the command "ng generate service fetch-api-data" within the app folder
 */

import { Injectable } from '@angular/core'; // generated automatically

// Added in myself
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://rcarpus-movie-api.herokuapp.com/';

// Generated automatically
@Injectable({
  providedIn: 'root'
})

/* generated automatically but not needed */
// export class FetchApiDataService {

//   constructor() { }
// }

export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {

  }

  // Making the api call for the usre registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error ocurred:', error.error.message);
    } else {
      console.error(
        `Error status code ${error.status} ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.'
    );
  }
}

