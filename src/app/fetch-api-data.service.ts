/**
 * This file contains all the functions for API calls.
 * 
 * @module FetchApiDataService
 */

import { Injectable } from '@angular/core'; // generated automatically

// Added in myself
import { catchError } from 'rxjs'; // This import statement seems to work just fine.
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * The root URL for the hosted API
 */
const apiUrl = 'https://rcarpus-movie-api.herokuapp.com/';

// Generated automatically
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) {
  }

  /**
   * API call to register a new user.
   * @param userDetails {Username: <string>, Password: <string> 
   * Email: <string>, BirthDate: <date (optional)>}
   * @returns data for new user
   */
  public userRegistration(userDetails: any): Observable<any> {
    // I want to prevent the API from receiving an empty string for the Birthday.
    // This would make the registration fail.
    let userDetailsToSend = { ...userDetails };
    if (userDetails.Birthday === '' ) delete userDetailsToSend.Birthday;
    return this.http.post(apiUrl + 'users/register', userDetailsToSend).pipe(
      catchError(this.handleLoginError)
    );
  }

  /**
   * API call to login an existing user
   * @param loginCredentials {Username: <string>, Password: <string>}
   * @returns {user, token}
   */
  public userLogin(loginCredentials: any): Observable<any> {
    return this.http.post(apiUrl + 'login', loginCredentials).pipe(
      catchError(this.handleLoginError)
    );
  }

  /**
   * API call to update a user's account info.
   * Pulls username and token from local storage to use for 
   * endpoint and authorization.
   * @param updatedInfo {Username: <string>, Password: <string>,
   * Email: <string>, BirthDate: <string>} (all fields optional)
   * @returns updated user info
   */
  public updateUserData(updatedInfo: any): Observable<any> {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user, updatedInfo, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * API call to get data for all movies.
   * Pulls token from localStorage for auth.
   * @returns object containing data for all movies
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to get data for one movie.
   * Pulls token from localStorage for auth.
   * @param movieTitle <string>
   * @returns object containing data for one movie.
   */
  public getOneMovie(movieTitle: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + movieTitle, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to get data for a genre.  
   * Pulls token from localStorage for auth.
   * @param genre <string>
   * @returns object containing data for one genre
   */
  public getGenre(genre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'genres/' + genre, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to get data for a director.  
   * Pulls token from localStorage for auth.
   * @param name <string>
   * @returns object containing data for one director
   */
  public getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors/' + name, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to add a movie to a user's favorites.  
   * Pulls username and token from localStorage.  
   * @param movieID <string>
   * @returns updated user data
   */
  public addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.post(apiUrl + 'users/' + user + '/movies/' + movieID, null, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to get an array of movie IDs corresponding to the user's favorites.
   * Pulls username and token from localStorage.
   * @returns [<string>]
   */
  public getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.get(apiUrl + 'users/' + user + '/movies' , {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to remove a movie from the user's list of favorites.
   * Pulls username and token from localStorage.
   * @param movieID <string>
   * @returns updated user data
   */
  public removeFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.delete(apiUrl + 'users/' + user + '/movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to delete a user's account.
   * Pulls username and token from localStorage.
   * @returns <string> message indicated the user was deleted.
   */
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.delete(apiUrl + 'users/' + user, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to get data for all users.
   * Pulls token from localStorage.
   * @returns object containing data for all users.
   */
  public getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * API call to get data for one user.
   * Pulls token from localStorage.
   * @param user <string>
   * @returns object containing user's data.
   */
  public getOneUser(user: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
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

  private handleLoginError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error ocurred:', error.error.message);
    } else {
      console.error(
        `Error status code ${error.status} ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Invalid credentials.'
    );
  }
}


