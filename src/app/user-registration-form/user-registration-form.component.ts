/**
 * Renders a registration form for users to make a new account.  
 * The user must supply a valid Username, Password, Email, and 
 * (optional) Birthday.
 * 
 * @module UserRegistrationFormComponent
 */

import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Boolean that triggers a loading animation used while awaiting 
   * a response from the server.
   */
  loading: boolean = false;

  /**
   * The input userData is empty strings by default.
   * This is updated when the suer types into the form fields.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  /**
   * Attempts to register the user with teh input credentials.  
   * Uses [[FetchApiDataService.userRegistration]].  
   * Upon sucessful registration, the user can then log in.  
   * If registration fails, the user sees a snackbar dialog 
   * warning them that the credentials are invalid.
   */
  registerUser(): void {
    this.loading = true;
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      this.dialogRef.close();
      this.loading = false;
      this.snackBar.open('Registered', 'Now you can log in', {
        duration: 2000
      });
    }, (result) => {
      console.log(result);
      this.loading = false;
      this.snackBar.open('Registration failed', 'Credentials are invalid', {
        duration: 2000
      });
    });
  }
}
