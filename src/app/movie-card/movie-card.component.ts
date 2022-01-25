import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(public fetchApiData: FetchApiDataService) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      // ImagePath is saved to server as <MovieTitle>.jpg
      // I need to modify the returned data to find the actual image path in this app.
      this.movies.forEach(movie => {
        movie.ImagePath = `../assets/img/${movie.ImagePath}`;
      })
      console.log(this.movies);
      return this.movies;
    });
  }

}
