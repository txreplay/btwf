import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AuthService, ScopesBuilder, AuthConfig, TokenService} from 'spotify-auth';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  apiURL: string;
  apiAccountsURL: string;
  redirectUri: string;
  clientId: string;

  constructor(private http: HttpClient, private tokenSvc: TokenService, private authService: AuthService) {
    this.apiAccountsURL = 'https://accounts.spotify.com/api';
    this.apiURL = 'https://api.spotify.com/v1';
    this.redirectUri = `${environment.spotifyRedirectUri}`;
    this.clientId = `${environment.spotifyClientId}`;
  }

  static httpHeaders(token) {
    return {headers: new HttpHeaders({Authorization: `Bearer ${token}`})};
  }

  public spotifyConnect() {
    const scopes = new ScopesBuilder().build();

    const authConfig: AuthConfig = {
      client_id: this.clientId,
      response_type: 'token',
      redirect_uri: this.redirectUri,
      state: '',
      show_dialog: true,
      scope: scopes
    };

    this.authService.configure(authConfig).authorize();
  }

  apiPlaySpotify(token) {
    return this.http
      .put(`${this.apiURL}/me/player/play`, {}, SpotifyService.httpHeaders(token))
      .pipe(map((res: any) => res))
      .toPromise();
  }

  apiPauseSpotify(token) {
    return this.http
      .put(`${this.apiURL}/me/player/pause`, {}, SpotifyService.httpHeaders(token))
      .pipe(map((res: any) => res))
      .toPromise();
  }

  apiNextSpotify(token) {
    return this.http
      .post(`${this.apiURL}/me/player/next`, {}, SpotifyService.httpHeaders(token))
      .pipe(map((res: any) => res))
      .toPromise();
  }

  apiCurrentlyPlaying(token) {
    return this.http
      .get(`${this.apiURL}/me/player/currently-playing`, SpotifyService.httpHeaders(token))
      .pipe(map((res: any) => res))
      .toPromise();
  }

  search(query, token) {
    return this.http
      .get(`${this.apiURL}/search?q=${query}&type=track`, SpotifyService.httpHeaders(token))
      .pipe(map((res: any) => res))
      .toPromise();
  }
}
