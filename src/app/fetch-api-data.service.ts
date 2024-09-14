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

  /**
   * Returns HTTP headers with the authorization token and username.
   * Throws an error if token or user is missing in local storage.
   *
   * @throws Will throw an error if the token or user is not found in local storage.
   * @returns Object containing HTTP headers and the username.
   */
  private getAuthHeaders(): { headers: HttpHeaders, username: string } {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token) {
      throw new Error('Token not found, please log in again.');
    }

    if (!user) {
      throw new Error('User not logged in')
    }

    const parsedUser = JSON.parse(user);
    const username = parsedUser.Username;

    if (!username) {
      throw new Error('Username is missing in local storage.');
    }
    
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
      username: username,
    };
  }

  /**
   * Registers a new user.
   * 
   * @param userDetails - An object containing user registration information.
   * @returns Observable containing the HTTP response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * 
   * @param userDetails - An object containing the user's login details (username and password).
   * @returns Observable containing the HTTP response with user data.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches all movies from the API.
   * 
   * @returns Observable containing the list of all movies.
   */
  getAllMovies(): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + 'movies', { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a specific movie by its title.
   * 
   * @param title - The title of the movie.
   * @returns Observable containing the movie details.
   */
  getMovie(title: string): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + `movies/${title}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches director information by name.
   * 
   * @param name - The director's name.
   * @returns Observable containing the director's details.
   */
  getDirector(name: string): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + `movies/directors/${name}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a genre by its name.
   * 
   * @param name - The genre name.
   * @returns Observable containing genre details.
   */
  getGenre(name: string): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + `movies/genre/${name}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches all registered users.
   * 
   * @returns Observable containing the list of all users.
   */
  getAllUsers(): Observable<any> {
    const { headers } = this.getAuthHeaders();
    return this.http.get(apiUrl + 'users', { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a user's favorite movies.
   * 
   * @returns Observable containing the list of favorite movies for the logged-in user.
   */
  getFavoriteMovies(): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.get(apiUrl + `users/${username}/movies`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Adds a movie to the user's list of favorite movies.
   * 
   * @param movieId - The ID of the movie to be added.
   * @returns Observable containing the updated list of favorite movies.
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.post(apiUrl + `users/${username}/movies/${movieId}`, {}, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from the user's list of favorite movies.
   * 
   * @param movieId - The ID of the movie to be removed.
   * @returns Observable containing the updated list of favorite movies.
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.delete(apiUrl + `users/${username}/movies/${movieId}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches the logged-in user's data.
   * 
   * @returns Observable containing the user's details.
   */
  getUser(): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.get(apiUrl + `users/${username}`, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Edits the logged-in user's information.
   * 
   * @param userData - An object containing the updated user data.
   * @returns Observable containing the updated user details.
   */
  editUser(userData: any): Observable<any> {
    const { headers, username } = this.getAuthHeaders();
    return this.http.put(apiUrl + `users/${username}`, userData, { headers }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes the logged-in user's account.
   * 
   * @returns Observable confirming the account deletion.
   */
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
