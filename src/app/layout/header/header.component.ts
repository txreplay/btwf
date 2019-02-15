import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public hide: boolean;

  constructor(private location: Location, private router: Router) {
    this.hide = true;
  }

  ngOnInit() {
    // if (this.router.url === '/homepage') {
    //   this.hide = true;
    // }
    //
    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
    //   if (event.url !== '/homepage') {
    //     this.hide = false;
    //   }
    // });
  }

  goBack() {
    this.location.back();
  }
}
