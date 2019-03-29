import { Component, OnInit } from '@angular/core';

import {SpotifyService} from '../services/spotify.service';
import {PouchdbService} from '../services/pouchdb.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForage} from 'ngforage';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: []
})
export class AdminComponent implements OnInit {
  public user: any;
  public roomName: string;
  public room: any;
  public accessToken: string;

  constructor(
    private acRoute: ActivatedRoute,
    public router: Router,
    public spotifyService: SpotifyService,
    public pouchdb: PouchdbService,
    private readonly ngf: NgForage
  ) {
    this.roomName = this.acRoute.snapshot.paramMap.get('id');
  }

  async ngOnInit() {
    if (!this.roomName) {
      this.user = await this.pouchdb.getUser();
      this.roomName = this.user.room;
    }

    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    this.room = await this.pouchdb.syncPouch();
    this.user = await this.pouchdb.getUser();
  }

  async startGame() {
    // await this.pouchdb.changeRoomStatus('playing', this.roomName);
    await this.spotifyService.pauseSpotify();
    await this.pouchdb.changeBuzzabilityStatus(true, this.roomName);
  }

  // async spotifyConnect() {
  //   this.accessToken = await this.spotifyService.apiGetToken();
  //   await this.ngf.setItem('accessToken', 'this.accessToken');
  // }
}
