import { Component, Input, OnInit } from '@angular/core';

// This is used to display notification back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';

import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() updatedUserData: any = { Username: '', Password: '', Email: '', Birthday: '' };
  userData: any = {
    Username: localStorage.getItem('user') || '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    let user:string = localStorage.getItem('user') || '';
    console.log(`loading data for: ${user}`);
    this.fetchApiData.getOneUser(user).subscribe((resp: any) => {
      this.userData = resp;
      console.log(resp);
      return resp;
    }, (error: any) => {
      console.error(error);
      localStorage.clear();
      location.href='.';
    })
  }

  updateUser(): void {
    let user:string = localStorage.getItem('user') || '';
    console.log(`updated data for ${user}`);
    console.log(this.updatedUserData);
    let dataToSend:any = {};
    if (this.updatedUserData.Username !== '') dataToSend.Username = this.updatedUserData.Username;
    if (this.updatedUserData.Password !== '') dataToSend.Password = this.updatedUserData.Password;
    if (this.updatedUserData.Email !== '') dataToSend.Email = this.updatedUserData.Email;
    if (this.updatedUserData.Birthday !== '') dataToSend.Birthday = this.updatedUserData.Birthday;
    console.log(dataToSend);
    this.fetchApiData.updateUserData(dataToSend).subscribe((resp: any) => {
      this.userData = resp;
      console.log(resp);
      return resp;
    }, (error: any) => {
      console.error(error);
      console.log('failed to update user data');
    });
  }

}
