import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'create-item-message',
  styleUrls: ['./create-new-item-message.component.less'],
  templateUrl: './create-new-item-message.component.html'
})

export class CreateItemMessageComponent implements OnInit {
  message = {};
  
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
   this.message = data;
  }

  ngOnInit() { }
}
