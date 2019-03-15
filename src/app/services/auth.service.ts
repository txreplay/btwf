import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import {User} from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState: any = null;
  public user: User;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => this.authState = auth);
  }

  currentUserId(): string {
    if (this.authState !== null) {
      return (this.authState.hasOwnProperty('uid')) ? this.authState.uid : (this.authState.hasOwnProperty('user')) ? this.authState.user.uid : null;
    } else {
      return null;
    }
  }

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then(user => this.authState = user)
      .catch(error => console.log(error));
  }

  async signOut(): Promise<any> {
    await this.afAuth.auth.signOut();
  }
}
