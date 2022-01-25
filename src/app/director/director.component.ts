import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
export class DirectorComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { 
    console.log(data);
  }

  ngOnInit(): void {
  }

}
