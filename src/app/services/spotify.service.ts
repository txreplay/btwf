import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  apiURL: string;
  apiAccountsURL: string;
  client: string;
  httpHeadersToken: any;

  constructor(private http: HttpClient) {
    this.apiAccountsURL = 'https://accounts.spotify.com/api';
    this.apiURL = 'https://api.spotify.com/v1';
    this.client = '58acfbd0300a41739ed8a45788e329eb:a492383738b646d485ce52e43ab0f777';
    this.httpHeadersToken = {
      headers: new HttpHeaders({
        Authorization: `Basic ${btoa(this.client)}`
      })
    };
  }

  static httpHeaders(token) {
    return {headers: new HttpHeaders({Authorization: `Bearer ${token}`})};
  }

  apiGetToken() {
    return this.http
      .post(`${this.apiAccountsURL}/token`, 'grant_type=client_credentials', this.httpHeadersToken)
      .pipe(
        map((res: any) => res.access_token)
      );
  }

  search(query, token) {
    return this.http
      .get(`${this.apiURL}/search?q=${query}&type=track`, SpotifyService.httpHeaders(token))
      .pipe(
        map((res: any) => res)
      );
  }
}
