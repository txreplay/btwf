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
  public searchResult: Array<any>;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public spotify: SpotifyService,
    public pouchdb: PouchdbService,
    private readonly ngf: NgForage
  ) {
    this.roomName = this.route.snapshot.paramMap.get('id');

    if (!this.roomName) {
      this.router.navigate(['homepage']);
    }
  }

  async ngOnInit() {
    this.accessToken =  await this.ngf.getItem('accessToken');
    console.log(this.accessToken);
    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    this.room = await this.pouchdb.syncPouch();
    this.user = await this.pouchdb.getUser();
  }

  async startGame() {
    await this.pouchdb.changeRoomStatus('playing', this.roomName);
    await this.pouchdb.changeBuzzabilityStatus(true, this.roomName);
  }

  spotifyConnect() {
    this.spotify.apiGetToken().subscribe(async (result: any) => {
      this.accessToken = result;
      await this.ngf.setItem('accessToken', result);
    });
  }

  search() {
    this.spotify.search('booba', this.accessToken).subscribe((result: any) => {
      console.log(result.tracks.items);
      this.searchResult = result.tracks.items;
    });
  }
}
