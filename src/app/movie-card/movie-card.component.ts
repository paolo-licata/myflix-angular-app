import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

/**
 * The MovieCardComponent displays a list of movies and allows users to view detailed information 
 * about genres, directors, and synopses, as well as add or remove movies from their favorites list.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
  * Navigates to the user's profile page.
  */
  goToProfile(): void {
    this.router.navigate(["profile"]);
  }

  /**
  * Logs out the user by navigating to the welcome page and removing user data from local storage.
  */
  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }

  /**
  * Fetches the list of movies from the API and assigns them to the `movies` array.
  */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        return this.movies;
      });
    }

  /**
  * Opens a dialog showing the director's information for a specific movie.
  * 
  * @param movie - The movie whose director information is to be displayed.
  */  
  showGenre(movie: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        name: movie.Genre.Name,
        description: movie.Genre.Description
      },
      role: 'dialog',
    });
  };

  /**
   * Opens a dialog showing the director's information for a specific movie.
   * 
   * @param movie - The movie whose director information is to be displayed.
   */
  showDirector(movie: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        name: movie.Director.Name,
        bio: movie.Director.Bio,
      },
      role: 'dialog',
    });
  };

  /**
  * Opens a dialog showing the synopsis for a specific movie.
  * 
  * @param movie - The movie whose synopsis is to be displayed.
  */
  showSynopsis(movie: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        title: movie.Title,
        description: movie.Description
      },
      role: 'dialog',
    });
  };

  /**
   * Adds a movie to the user's list of favorite movies.
   * If the movie is already a favorite, it removes it instead.
   * 
   * @param movie - The movie to be added or removed from favorites.
   */
  favoriteMovie(movie: any) {
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if the movie is already favorited
    if (!user.FavoriteMovies.includes(movie._id)) {
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe((resp: any) => {
        
        movie.isFavorite = true;
        user.FavoriteMovies = resp.FavoriteMovies; //Updates FavoriteMovies list for the user
        localStorage.setItem('user', JSON.stringify(user));

        this.snackBar.open(
        `${movie.Title} has been added to your favorites!`,
        'OK',
        {
          duration: 2000,
        }
      );
    });
    } else {
      this.removeFavoriteMovie(movie);
    }
  }

  /**
     * Removes a movie from the user's list of favorite movies.
     * 
     * @param movie - The movie to be removed from favorites.
     */
  removeFavoriteMovie(movie: any) {
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe((resp: any) => {      

      movie.isFavorite = false;
      user.FavoriteMovies = resp.FavoriteMovies;
      localStorage.setItem("user", JSON.stringify(user));

      this.snackBar.open(
        `${movie.Title} has been removed from your favorites!`,
        'OK',
        {
          duration: 2000,
        }
      );
    });
  };
}
