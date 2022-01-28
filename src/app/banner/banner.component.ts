/**
 * The Banner displays the website title and provides buttons to 
 * logout, view the user's profile, or view all the movies 
 * depending on what page is currently being viewed.  
 * The banner is rendered within `movie-card` and `profile`.
 * 
 * @module BannerComponent
 */

import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  /** onProfilePage is a boolean indicating whether the user on the profile page or not. 
   * This is used within the template to determine whether or not to show links to the 
   * profile or the movie view.
   */
  onProfilePage: boolean = false;

  constructor(
    private router: Router,
  ) { }

  /**
   * When the banner loads, it checks the url to determine if it is on the profile page, 
   * and if so, sets the value of onProfilePage to true
   */
  ngOnInit(): void {
    this.onProfilePage = window.location.pathname.search(/profile/) > -1;
  }

  /**
   * Navigates to `'/profile'`  
   * This is called from a button.
   */
  toProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs out the user by clearing localStorage and navigating to `'/'`  
   * This is called from a logout button.
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  /**
   * Navigates to `'/movies'`  
   * This is called from a button.
   */
  toMovies(): void {
    this.router.navigate(['movies']);
  }
}
