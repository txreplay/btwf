import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {
  private authState: any = null;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(auth => this.authState = auth);
  }

  isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false;
  }

  currentUserId(): string {
    return (this.authState !== null) ? this.authState.uid : '';
  }

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then(user => {
        console.log(user);
        this.authState = user;
      })
      .catch(error => console.log(error));
  }

  async signOut(): void {
    await this.afAuth.auth.signOut();
  }
}
