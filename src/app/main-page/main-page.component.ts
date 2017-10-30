import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})

export class MainPageComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { }

  goToRegisterItem() {
    this.router.navigate(['/register']);
  }

  goToShowReport() {
    this.router.navigate(['/reports']);
  }
}
