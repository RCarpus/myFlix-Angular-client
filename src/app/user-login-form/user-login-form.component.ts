import { Component, Input, OnInit } from '@angular/core';

// I'll use this to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This brings the API calls I created in to this component
import { FetchApiDataService } from '../fetch-api-data.service';

// This is used to display notification back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  loading: boolean = false;

  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  loginUser(): void {
    this.loading = true;
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      // User was successfully logged in
      this.dialogRef.close();
      console.log(result);
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
