import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://my-movie-flix-a563168476e8.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) {}

  // Helper to get the token and username
  private getAuthHeaders(): { headers: HttpHeaders, username: string } {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('User not logged in')
    }
    const parsedUser = JSON.parse(user);
    const username = parsedUser.username;
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
      username: username,
    };
  }

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get all movies
  getAllMovies(): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + 'movies', { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get movie by title
  getMovie(title: string): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + `movies/${title}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get director by name
  getDirector(name: string): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + `movies/directors/${name}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get genre
  getGenre(name: string): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + `movies/genre/${name}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get all users
  getAllUsers(): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + 'users', { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get favorite movies by user
  getFavoriteMovies(): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.get(apiUrl + `users/${username}/movies`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Add or POST a favorite movie
  addFavoriteMovie(movieId: string): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.post(apiUrl + `users/${username}/movies/${movieId}`, {}, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete a movie from favorites
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.delete(apiUrl + `users/${username}/movies/${movieId}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get user data from local storage
  getUser(): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.get(apiUrl + `users/${username}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Edit user
  editUser(userData: any): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.put(apiUrl + `users/${username}`, userData, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete user
  deleteUser(): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.delete(apiUrl + `users/${username}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
