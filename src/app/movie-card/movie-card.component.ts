import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';

import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovieIDs: any[] = [];

  constructor(public fetchApiData: FetchApiDataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      /**
       * When the user loads the /movies page, loads in the movies and 
       * renders movie card elements. If this fails for any reason
       * (likely because the user is not logged in, or the token expired)
       * the localStorage gets cleared and the user is redirected to the home page.
       */
      this.movies = resp;
      // ImagePath is saved to server as <MovieTitle>.jpg
      // I need to modify the returned data to find the actual image path in this app.
      this.movies.forEach(movie => {
        movie.ImagePath = `../assets/img/${movie.ImagePath}`;
      });
      this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
        this.favoriteMovieIDs = resp;
        this.mapFavorites();
      });
      return this.movies;
    }, (error: any) => {
      console.log('hey idiot. You are not logged in. (Or the server is broke. Sorry)');
      console.error(error);
      localStorage.clear();
      location.href='.';
    });
  }

  getFavoriteMovies(): void {
    // called in getMovies() after loading in movie data
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favoriteMovieIDs = resp;
      console.log(this.favoriteMovieIDs);
    });
  }

  mapFavorites(): void {
    // caleled in getMovies() after loading in favoriteMovies
    this.movies.forEach(movie => {
      movie.isFavorite = this.favoriteMovieIDs.indexOf(movie._id) > -1 ? true : false;
    });
    console.log(this.movies);
  }

  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((resp:any) => {
      this.favoriteMovieIDs = resp.FavoriteMovies;
      console.log(this.favoriteMovieIDs);
      this.mapFavorites();
    })
  }

  removeFavorite(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe((resp:any) => {
      this.favoriteMovieIDs = resp.FavoriteMovies;
      console.log(this.favoriteMovieIDs);
      this.mapFavorites();
    })
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorComponent, {
      width: '280px',
      data: { director },
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreComponent, {
      width: '280px',
      data: { genre }
    });
  }

  toProfile(): void {
    location.href='/profile';
  }

  logout(): void {
    localStorage.clear();
    location.href='/';
  }

}
