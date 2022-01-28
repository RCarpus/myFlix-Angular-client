/**
 * A simple loading animation fixed in the center of the screen.  
 * Used whenever we are waiting on a response from the server.
 * 
 * @module LoadingAnimationComponent
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-animation',
  templateUrl: './loading-animation.component.html',
  styleUrls: ['./loading-animation.component.scss']
})
export class LoadingAnimationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
