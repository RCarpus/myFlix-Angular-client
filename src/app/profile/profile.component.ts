import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

// This is used to display notification back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';

import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  @Input() updatedUserData: any = { Username: '', Password: '', Email: '', Birthday: '' };
  userData: any = {
    Username: localStorage.getItem('user') || '',
    Email: '',
    Birthday: '',
  };
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    /**
     * Loads in the user data and 
     * THEN fetches movies
     */
    let user: string = localStorage.getItem('user') || '';
    console.log(`loading data for: ${user}`);
    this.fetchApiData.getOneUser(user).subscribe((resp: any) => {
      this.userData = resp;
      console.log(resp);
      this.getMovies();
      return resp;
    }, (error: any) => {
      console.error(error);
      localStorage.clear();
      location.href = '.';
    });
  }

  updateUser(): void {
    /**
     * Updates the user's data. Only send data to server for fields that have been filled in.
     * If the data is formatted poorly, the error from the server should trigger
     * a warning message to the user to check their data format.
     */
    let user: string = localStorage.getItem('user') || '';
    console.log(`updated data for ${user}`);
    console.log(this.updatedUserData);
    let dataToSend: any = {};
    if (this.updatedUserData.Username !== '') dataToSend.Username = this.updatedUserData.Username;
    if (this.updatedUserData.Password !== '') dataToSend.Password = this.updatedUserData.Password;
    if (this.updatedUserData.Email !== '') dataToSend.Email = this.updatedUserData.Email;
    if (this.updatedUserData.Birthday !== '') dataToSend.Birthday = this.updatedUserData.Birthday;
    console.log(dataToSend);
    this.fetchApiData.updateUserData(dataToSend).subscribe((resp: any) => {
      this.userData = resp;
      console.log(resp);
      this.snackBar.open('updated sucessfully', '', {
        duration: 3000,
        panelClass: ['sucessful-snack']
      });
      return resp;
    }, (error: any) => {
      console.error(error);
      console.log('failed to update user data');
      this.snackBar.open('update failed', 'Check for correct format.', {
        duration: 3000,
        panelClass: ['failed-snack']
      })
    });
  }

  getMovies(): void {
    /**
     * Download all the movie data and THEN filter out the favorites
     */
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach(movie => {
        movie.ImagePath = `../assets/img/${movie.ImagePath}`;
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

  removeFavorite(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe((resp:any) => {
      location.reload();
    })
  }

  toMovies(): void {
    location.href='/movies';
  }

  logout(): void {
    localStorage.clear();
    location.href='/';
  }

  deleteUserAccount(): void {
    let confirmed:boolean = window.confirm('WARNING: This can not be undone. Are you sure you want to delete your profile?');
    console.log(confirmed);
    if (confirmed) {
      this.fetchApiData.deleteUser().subscribe((resp:any) => {
        console.log(resp);
        localStorage.clear();
        location.href = '/';
      }, (error:any) => {
        console.error(error);
        console.log('This is not really an error');
        this.snackBar.open('bye', 'don\'t let the door hit you on the way out');
        localStorage.clear();
        location.href = '/';
      });
    }
  }

}
