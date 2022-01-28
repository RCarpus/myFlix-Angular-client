/**
 * The Genre component displays data about a genre and is implemented 
 * when clicking on the "genre" button on a movie card.
 * 
 * @module GenreComponent
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
   }

  ngOnInit(): void {
  }

}
