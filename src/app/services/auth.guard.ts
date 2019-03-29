import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';

import {PouchdbService} from './pouchdb.service';

@Injectable()
export class AuthGuard implements CanActivateChild {

  constructor(private router: Router, private pouchdbService: PouchdbService) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    this.pouchdbService.getUser().then((user) => {
      console.log({user});
      if (!user) {
        this.router.navigate(['homepage']);
      }
    });

    return true;
  }
}
