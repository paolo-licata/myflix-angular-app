import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';


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

goToProfile(): void {
  this.router.navigate(["profile"]);
}

logout(): void {
  this.router.navigate(["welcome"]);
  localStorage.removeItem("user");
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  //Open a dialog with genre information
  showGenre(movie: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        name: movie.Genre.Name,
        description: movie.Genre.Description
      },
      role: 'dialog',
    });
  };

  //opens dialog with director info
  showDirector(movie: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        name: movie.Director.Name,
        bio: movie.Director.Bio,
      },
      role: 'dialog',
    });
  };

  //opens dialog with plot info
  showSynopsis(movie: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        title: movie.Title,
        description: movie.Description
      },
      role: 'dialog',
    });
  };

  //Adds a movie to Favorites
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

// Unfavorite a movie
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
