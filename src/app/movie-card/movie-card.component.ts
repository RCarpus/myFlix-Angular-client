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

  /**
   * When the user loads the `/movies` page, loads in the movies and
   * renders movie card elements.  
   * Then, an array of the user's favorite movies by ID is fetched from
   * the server and each movie that is in that list is marked as favorite.  
   * 
   * If this fails for any reason 
   * (likely because the user is not logged in, or the token expired) 
   * the localStorage gets cleared (logout) 
   * and the user is redirected to the home page.
   */
  getMovies(): void {
    this.loading = true;           // turn on loading animation
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      // ImagePath is saved to server as <MovieTitle>.jpg
      this.movies.forEach(movie => {
        movie.ImagePath = `./assets/img/${movie.ImagePath}`;
      });
      this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
        this.favoriteMovieIDs = resp;
        this.mapFavorites();
        this.loading = false;      // turn off loading animation
      });
      return this.movies;
    }, (error: any) => {
      console.log('hey idiot. You are not logged in. (Or the server is broke. Sorry)');
      console.error(error);
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }

  /**
   * Fetches the logged in user's favorite movies from the server.  
   * This function is called from [[MovieCardComponent.getMovies]].
   */
  getFavoriteMovies(): void {
    // called in getMovies() after loading in movie data
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favoriteMovieIDs = resp;
    });
  }

  /**
   * Sets the isFavorite attribute of each movie to true or false.  
   * This is called after fetching the favorites with 
   * [[MovieCardComponent.getFavoriteMovies]] from within 
   * [[MovieCardComponent.getMovies]].
   */
  mapFavorites(): void {
    this.movies.forEach(movie => {
      movie.isFavorite = this.favoriteMovieIDs.indexOf(movie._id) > -1 ? true : false;
    });
    console.log(this.movies);
  }

  /**
   * @param id string containing the ID of a movie to be added to the user's 
   * list of favorite movies.  
   * 
   * Adds a movie to a user's list of favorites with a POST request via 
   * [[FetchApiDataService.addFavoriteMovie]].  
   * Then, changes the movie's star icon from emtpy to filled in 
   * and displays a confirmation message.
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((resp: any) => {
      this.favoriteMovieIDs = resp.FavoriteMovies;
      this.mapFavorites();
      this.snackBar.open('Good choice!', 'Added to Favorites', {
        duration: 2000,
        panelClass: ['added-to-favorites'],
      })
    })
  }

  /**
   * @param id string containing the ID of a movie to be removed from the user's
   * list of favorite movies.
   * 
   * Removes a movie from a user's list of favorites with a DELETE request via
   * [[FetchApiDataService.removeFavoriteMovie]]. 
   * Then, changes the movie's star icon from filled in to empty
   * and displays a confirmation message.
   */
  removeFavorite(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe((resp: any) => {
      this.favoriteMovieIDs = resp.FavoriteMovies;
      console.log(this.favoriteMovieIDs);
      this.mapFavorites();
      this.snackBar.open('I don\'t like that one either!', 'Removed from Favorites', {
        duration: 2000
      });
    })
  }

  /**
   * @param director {Name: <string>, Bio: <string>, BirthYear: <string>}  
   * Opens a dialog box with a DirectorComponent, passing the director 
   * data into the component.
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorComponent, {
      width: '280px',
      data: { director },
    });
  }

  /**
   * 
   * @param genre {Name: <string>, Description: <string>}  
   * Opens a dialog box with a GenreComponent, passing the genre data
   * into the component.
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreComponent, {
      width: '280px',
      data: { genre }
    });
  }

  /**
   * 
   * @param movie {Title: <string>, Summary: <string>, ... }  
   * Opens a dialog box with a DescriptionComponent, passing the movie data
   * into the component.
   */
  openDescriptionDialog(movie: any): void {
    this.dialog.open(DescriptionComponent, {
      width: '280px',
      data: { movie }
    });
  }


}
