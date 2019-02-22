import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import {User} from '../../models/user.model';

@Injectable()
export class AuthService {
  private authState: any = null;
  public user: User;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(auth => this.authState = auth);
  }

  currentUserId(): string {
    return (this.authState !== null) ? this.authState.user.uid : '';
  }

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then(user => {
        this.authState = user;
      })
      .catch(error => console.log(error));
  }

  async signOut(): Promise<any> {
    await this.afAuth.auth.signOut();
  }
}
