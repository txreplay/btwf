import { Component } from '@angular/core';
import {NgForage} from 'ngforage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private readonly ngf: NgForage, private router: Router) {
  }

  async reset() {
    await this.ngf.clear();
    await this.router.navigate(['/']);
    location.reload();
  }
}
