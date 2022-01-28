import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  onProfilePage: boolean = false;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.onProfilePage = window.location.pathname.search(/profile/) > -1;
  }

  toProfile(): void {
    this.router.navigate(['profile']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  toMovies(): void {
    this.router.navigate(['movies']);
  }
}
