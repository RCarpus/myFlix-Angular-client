import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    ) { }

  ngOnInit(): void {
  }

  // This is the function that will open the dialog whenthe signup button is clicked
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      // Assigning the dialog a width
      width: '280px'
    });
  }

  openUserLoginDialog(): void {
    /**
     * If the user is already logged in, they should have a valid JWT
     * saved in localStorage already. This function checks for a JWT first.
     * If it's found, the user is redirected to the movie card page.
     * Otherwise, the login dialog should open.
     */
    if (localStorage.getItem('token')) this.router.navigate(['movies']);
    else {
      this.dialog.open(UserLoginFormComponent, {
        // Assigning the dialog a width
        width: '280px'
      });
    }

  }

}
