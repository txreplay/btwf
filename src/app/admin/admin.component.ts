import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import {NgForage} from 'ngforage';

import {AuthService} from '../services/auth.service';
import {RoomService} from '../services/room.service';
import {User} from '../../models/user.model';
import SpotifyWebApi from 'spotify-web-api-js';
import {SpotifyService} from '../services/spotify.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [NgForage]
})
export class AdminComponent implements OnInit {
  private user: User;
  public accessToken: string;

  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
    public spotify: SpotifyService,
    public room: RoomService,
    private readonly ngf: NgForage,
  ) {

  }

  async ngOnInit() {
    this.ngf.getItem('accessToken').then((accessToken: any) => {
      this.accessToken = accessToken;
    });
  }

  spotifyConnect() {
    this.spotify.apiGetToken().subscribe(async (result: any) => {
      this.accessToken = result;
      await this.ngf.setItem('accessToken', result);
    });
  }

  search() {
    this.spotify.search('booba', this.accessToken).subscribe((result) => {
      console.log(result);
    });
  }

}
