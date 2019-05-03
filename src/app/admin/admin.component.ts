import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForage} from 'ngforage';
import PouchDB from 'pouchdb-browser';

import {SpotifyService} from '../services/spotify.service';
import {PouchdbService} from '../services/pouchdb.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: []
})
export class AdminComponent implements OnInit {
  public roomName: string;
  public room: any;
  public user: any;
  public leaderboard: Array<any> = [];

  public accessToken: string;

  constructor(
    private acRoute: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService,
    private pouchdb: PouchdbService,
    private zone: NgZone,
    private readonly ngf: NgForage,
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
    this.updateLeaderboard();
  }

  async startGame() {
    await this.pouchdb.changeRoomStatus('playing', this.roomName);
    await this.pouchdb.changeBuzzabilityStatus(true, this.user.username, this.roomName);
    await this.spotifyService.apiPlaySpotify(this.accessToken);
  }

  async answerIsCorrect() {
    if (this.room.lastBuzzer) {
      await this.pouchdb.addPointToPlayer(this.room.lastBuzzer, this.roomName);
    }

    await this.pouchdb.changeBuzzabilityStatus(true, this.user.username, this.roomName);
    await this.spotifyService.apiNextSpotify(this.accessToken);
  }

  async answerIsWrong() {
    await this.pouchdb.changeBuzzabilityStatus(true, this.user.username, this.roomName);
    await this.spotifyService.apiPlaySpotify(this.accessToken);
  }

  updateLeaderboard() {
    this.leaderboard = [];
    this.room.players.map((player) => {
      const playerArr = player.split('#');
      this.leaderboard.push({name: playerArr[0], score: playerArr[1]});
    });
    this.leaderboard.sort((a, b) => b.score - a.score);
  }

  pouchDbSync() {
    PouchDB.sync(this.pouchdb.localDbUrl, this.pouchdb.remoteDbUrl, {live: true, retry: true}).on('change', async (sync) => {
      await this.zone.run(async () => {
        console.log('--- SYNC --- ');
        const room: any = sync.change.docs[0];
        this.room = room;
        this.updateLeaderboard();
        const accessToken = await this.ngf.getItem('accessToken');

        if (accessToken) {
          try {
            (room.isBuzzable) ? await this.spotifyService.apiPlaySpotify(accessToken) : await this.spotifyService.apiPauseSpotify(accessToken);
          } catch (e) {
            await this.spotifyService.spotifyConnect();
          }
        }
      });
    }).on('error', (err) => {
      console.error(err);
    });
  }
}
