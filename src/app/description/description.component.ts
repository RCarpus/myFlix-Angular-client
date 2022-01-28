/**
 * The Description component is used to display a discription of a movie in a dialog box when 
 * the user clicks the description button on a movie card.
 * 
 * @module DescriptionComponent
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  /**
   * 
   * @param data An object containing movie data. Must have Title and Description parameters 
   * both containing strings.
   * 
   */
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
