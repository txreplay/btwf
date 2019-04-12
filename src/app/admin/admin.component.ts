import { Component, OnInit } from '@angular/core';

import {SpotifyService} from '../services/spotify.service';
import {PouchdbService} from '../services/pouchdb.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForage} from 'ngforage';
import PouchDB from 'pouchdb-browser';

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
    this.acRoute.fragment.subscribe(async (fragment) => {
      if (fragment) {
        this.accessToken = new URLSearchParams(fragment).get('access_token');
        await this.ngf.setItem('accessToken', this.accessToken);
        await this.router.navigate(['admin']);
      } else {
        this.accessToken = await this.ngf.getItem('accessToken');
      }
    });

    this.pouchDbSync();
  }

  async ngOnInit() {
    if (!this.roomName) {
      this.user = await this.pouchdb.getUser();
      this.roomName = this.user.room;
    }

    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    this.user = await this.pouchdb.getUser();
    console.log(this.room);
  }

  async startGame() {
    await this.pouchdb.changeRoomStatus('playing', this.roomName);
    await this.pouchdb.changeBuzzabilityStatus(true, this.roomName);
  }

  async nextSong() {
    await this.pouchdb.changeBuzzabilityStatus(true, this.roomName);
  }

  pouchDbSync() {
    PouchDB.sync(this.pouchdb.localDB, this.pouchdb.remoteDB, {live: true, retry: true}).on('change', async (sync) => {
      console.log('--- SYNC --- ');
      const room = sync.change.docs[0];
      const accessToken = await this.ngf.getItem('accessToken');

      if (accessToken) {
        try {
          (room.isBuzzable) ? await this.spotifyService.apiPlaySpotify(accessToken) : await this.spotifyService.apiPauseSpotify(accessToken);
        } catch (e) {
          await this.spotifyService.spotifyConnect();
        }
      }
      this.room = room;
      console.log(room);
    }).on('error', (err) => {
      console.log(err);
    });
  }
}
