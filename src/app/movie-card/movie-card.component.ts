/**
 * Renders a responsive grid of movie cards for each movie in the database.  
 * Each movie card has an image, links to open dialogs for genre, director, and description 
 * components, and a toggle button to add or remove the movie from the user's favorites.  
 *   
 * Also renders a BannerComponent.
 * 
 * @module MovieCardComponent
 */

import { Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { DescriptionComponent } from '../description/description.component';
import { BannerComponent } from '../banner/banner.component';
import { LoadingAnimationComponent } from '../loading-animation/loading-animation.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovieIDs: any[] = [];
  loading: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService, 
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.loading = true;
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
        movie.ImagePath = `./assets/img/${movie.ImagePath}`;
      });
      this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
        this.favoriteMovieIDs = resp;
        this.mapFavorites();
        this.loading = false;
      });
      return this.movies;
    }, (error: any) => {
      console.log('hey idiot. You are not logged in. (Or the server is broke. Sorry)');
      console.error(error);
      localStorage.clear();
      this.router.navigate(['/']);
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
      this.snackBar.open('Good choice!', 'Added to Favorites', {
        duration: 2000,
        panelClass: ['added-to-favorites'],
        
      })
    })
  }

  removeFavorite(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe((resp:any) => {
      this.favoriteMovieIDs = resp.FavoriteMovies;
      console.log(this.favoriteMovieIDs);
      this.mapFavorites();
      this.snackBar.open('I don\'t like that one either!', 'Removed from Favorites', {
        duration: 2000
      });
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

  openDescriptionDialog(movie: any): void {
    this.dialog.open(DescriptionComponent, {
      width: '280px',
      data: { movie }
    });
  }


}
