import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  url: string = '';
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.url = window.location.pathname;
    console.log(this.url);
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
