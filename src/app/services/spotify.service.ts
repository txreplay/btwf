import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AuthService, ScopesBuilder, AuthConfig, TokenService} from 'spotify-auth';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  apiURL: string;
  apiAccountsURL: string;
  client: string;

  constructor(private http: HttpClient, private tokenSvc: TokenService, private authService: AuthService) {
    this.apiAccountsURL = 'https://accounts.spotify.com/api';
    this.apiURL = 'https://api.spotify.com/v1';
    this.client = '58acfbd0300a41739ed8a45788e329eb';
  }

  static httpHeaders(token) {
    return {headers: new HttpHeaders({Authorization: `Bearer ${token}`})};
  }

  public spotifyConnect() {
    const scopes = new ScopesBuilder().build();

    const authConfig: AuthConfig = {
      client_id: this.client,
      response_type: 'token',
      redirect_uri: 'http://localhost:4204/admin',
      state: '',
      show_dialog: true,
      scope: scopes
    };

    this.authService.configure(authConfig).authorize();
  }

  apiGetToken() {
    const httpTokenHeaders = {headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(this.client)}`
    })};

    return this.http
      .post(`${this.apiAccountsURL}/token`, 'grant_type=client_credentials&scope=user-modify-playback-state', httpTokenHeaders)
      .pipe(map((res: any) => res.access_token))
      .toPromise();
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
      .put(`${this.apiURL}/me/player/next`, {}, SpotifyService.httpHeaders(token))
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
