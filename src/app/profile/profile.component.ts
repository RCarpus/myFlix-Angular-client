/**
 * Renders a form for users to update their account information and 
 * an array of movie cards corresponding to their favorite movies.  
 * 
 * Also renders a BannerComponent.
 * 
 * @module ProfileComponent
 */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';

import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { DescriptionComponent } from '../description/description.component';
import { BannerComponent } from '../banner/banner.component';
import { LoadingAnimationComponent } from '../loading-animation/loading-animation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  /**
   * Starts the value of each form field as an empty string. When the user types 
   * into the field, the updatedUserData is updated as well.
   */
  @Input() updatedUserData: any = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * userData is a subset of updatedUserData containing only 
   * Username, Email, and Birthday. This is not used in the forms.  
   * This is used to display the user's current into to the user above the form.
   */
  userData: any = {
    Username: localStorage.getItem('user') || '',
    Email: '',
    Birthday: '',
  };

  /**
   * Stores data about each movie in the database.
   */
  movies: any[] = [];

  /**
   * A subset of movies containing only the user's favorites.
   */
  favoriteMovies: any[] = [];

  /**
   * Boolean that triggers a loading animation used while awaiting 
   * a response from the server.
   */
  loading: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  /**
   * Fetches data for the logged in user.  
   * Then, downloads all the movie data and maps
   * the user's favorites to favoriteMovies.  
   * 
   * If the API call fails for some reason, the user will 
   * be logged out and returned to the welcome screen.
   */
  ngOnInit(): void {
    this.loading = true;
    let user: string = localStorage.getItem('user') || '';
    this.fetchApiData.getOneUser(user).subscribe((resp: any) => {
      this.userData = resp;
      this.getMovies();
      this.loading = false;
      return resp;
    }, (error: any) => {
      console.error(error);
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }


  /**
   * Updates the user's data. Only sends data to the server for fields 
   * that have been filled in. If the data is formatted poorly, the
   * error from the server should trigger a warning message to the user
   * to check their data format.
   */
  updateUser(): void {
    let user: string = localStorage.getItem('user') || '';
    let dataToSend: any = {};
    if (this.updatedUserData.Username !== '') dataToSend.Username = this.updatedUserData.Username;
    if (this.updatedUserData.Password !== '') dataToSend.Password = this.updatedUserData.Password;
    if (this.updatedUserData.Email !== '') dataToSend.Email = this.updatedUserData.Email;
    if (this.updatedUserData.Birthday !== '') dataToSend.Birthday = this.updatedUserData.Birthday;
    this.fetchApiData.updateUserData(dataToSend).subscribe((resp: any) => {
      this.userData = resp;
      this.snackBar.open('updated sucessfully', '', {
        duration: 3000,
        panelClass: ['sucessful-snack']
      });
      return resp;
    }, (error: any) => {
      console.error(error);
      this.snackBar.open('update failed', 'Check for correct format.', {
        duration: 3000,
        panelClass: ['failed-snack']
      })
    });
  }

  /**
   * Downloads all the movie data and saves into this.movies.  
   * Then, filter out the favorites and save into this.favoriteMovies.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach(movie => {
        movie.ImagePath = `./assets/img/${movie.ImagePath}`;
      });
      if (this.userData.FavoriteMovies) {
        this.favoriteMovies = this.userData.FavoriteMovies.map((_id: string) => {
          return this.movies.find((movie: any) => {
            return movie._id === _id;
          });
        });
      }
    }, (error: any) => {
      console.error(error);
    });
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

  /**
   * @param id string containing the ID of a movie to be removed from the user's
   * list of favorite movies.
   * 
   * Removes a movie from a user's list of favorites with a DELETE request via
   * [[FetchApiDataService.removeFavoriteMovie]]. 
   * Then, reloads the profile page, resulting in the removed movie disappearing
   */
  removeFavorite(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe((resp: any) => {
      location.reload();
    })
  }

  /**
   * Deletes the logged in user's account. Uses a window.confirm to confirm that the user
   * wants to delete their account.  
   * Deletes the account with [[FetchApiDataService.deleteUser]].  
   * Clears the localStorage and navigates to the welcome page.
   */
  deleteUserAccount(): void {
    let confirmed: boolean = window.confirm('WARNING: This can not be undone. Are you sure you want to delete your profile?');
    if (confirmed) {
      this.fetchApiData.deleteUser().subscribe((resp: any) => {
        localStorage.clear();
        this.router.navigate(['/']);
      }, (error: any) => {
        console.error(error);
        this.snackBar.open('bye', 'don\'t let the door hit you on the way out');
        localStorage.clear();
        this.router.navigate(['/']);
      });
    }
  }

}
