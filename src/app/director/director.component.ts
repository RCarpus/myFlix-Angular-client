/**
 * The Director component renders information about a director and is implemented when 
 * clicking the "director" button on a movie card. 
 * 
 * @module DirectorComponent
 */

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
export class DirectorComponent implements OnInit {

  /**
   * 
   * @param data An object containing director data. Must have Name, Bio, and BirthYear 
   * properties (all strings)
   */
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  ngOnInit(): void {
  }

}
