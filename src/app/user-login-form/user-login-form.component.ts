/**
 * Renders a login form for users to enter their Username and Password.
 * 
 * @module UserLoginFormComponent
 */

import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Boolean that triggers a loading animation used while awaiting 
   * a response from the server.
   */
  loading: boolean = false;

  /**
   * The input userData is empty strings by default.  
   * This is updated when the user types into the form fields.
   */
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Attempts to log the user in with the input credentials.  
   * Uses [[FetchApiDataService.userLogin]].  
   * Saves Username and token in localStorage and 
   * redirects to `/movies` upon successful login.  
   * Gives a snackbar message if login fails.
   */
  loginUser(): void {
    this.loading = true;
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      this.dialogRef.close();
      this.loading = false;
      localStorage.setItem('user', result.user.Username);
      localStorage.setItem('token', result.token);
      this.snackBar.open('Logged in', 'Welcome, ' + result.user.Username, {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (result) => {
      console.log(result);
      this.loading = false;
      this.snackBar.open('Login failed', 'Check your credentials', {
        duration: 2000
      });
    });
  }
}
