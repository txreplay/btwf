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
  httpOptions: any;
  accessToken: string;

  constructor(private http: HttpClient) {
    this.apiAccountsURL = 'https://accounts.spotify.com/api';
    this.apiURL = 'https://api.spotify.com/v1';
    this.client = '58acfbd0300a41739ed8a45788e329eb:a492383738b646d485ce52e43ab0f777';
  }

  apiGetToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        Authorization: `Basic ${btoa(this.client)}`
      })
    };

    return this.http
      .post(`${this.apiAccountsURL}/token`, 'grant_type=client_credentials', httpOptions)
      .pipe(
        map((res: any) => res.access_token)
      );
  }

  search(query, token) {
    console.log(token);
    return this.http
      .get(`${this.apiURL}/search?q=${query}&type=artist,track`, {headers: new HttpHeaders({Authorization: `Bearer ${token}`})})
      .pipe(
        map((res: any) => res)
      );
  }
}
