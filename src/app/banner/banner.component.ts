import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  url: string = '';
  constructor() { }

  ngOnInit(): void {
    this.url = window.location.pathname;
    console.log(this.url);
  }

  toProfile(): void {
    location.href = '/profile';
  }

  logout(): void {
    localStorage.clear();
    location.href = '/';
  }

  toMovies(): void {
    location.href = '/movies';
  }
}
