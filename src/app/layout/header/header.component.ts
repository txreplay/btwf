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
    const r = confirm('Ceci mettra fin à la partie, êtes-vous sûr ?');

    if (r) {
      await this.ngf.clear();
      await this.router.navigate(['/']);
      location.reload();
    }
  }
}
