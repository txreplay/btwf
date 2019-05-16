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
  public currentlyPlaying: any;
  public emoji: string;

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

    this.emoji = this.pouchdb.getEmojiFromAnimal(this.roomName);
    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    this.user = await this.pouchdb.getUser();
    this.updateLeaderboard();
  }

  async startGame() {
    await this.pouchdb.changeRoomStatus('playing', this.roomName);
    await this.pouchdb.changeBuzzabilityStatus(true, this.user.username, this.roomName);
    await this.spotifyService.apiPlaySpotify(this.accessToken);
  }

  async answerIsCorrect(nbPoints) {
    if (this.room.lastBuzzer) {
      await this.pouchdb.addPointToPlayer(nbPoints, this.room.lastBuzzer, this.roomName);
    }

    await this.pouchdb.resetLastBuzzer(this.roomName);
    await this.pouchdb.changeBuzzabilityStatus(true, this.user.username, this.roomName);
    await this.spotifyService.apiNextSpotify(this.accessToken);
  }

  async passSong() {
    await this.spotifyService.apiNextSpotify(this.accessToken);
    this.getCurrentlyPlaying();
  }

  async answerIsWrong() {
    await this.pouchdb.resetLastBuzzer(this.roomName);
    await this.pouchdb.changeBuzzabilityStatus(true, this.user.username, this.roomName);
    await this.spotifyService.apiPlaySpotify(this.accessToken);
  }

  async gameOver() {
    const r = confirm('Ceci mettra fin à la partie, êtes-vous sûr ?');

    if (r) {
      await this.spotifyService.apiPauseSpotify(this.accessToken);
      await this.pouchdb.changeRoomStatus('done', this.roomName);
    }
  }

  async returnHome() {
    await this.ngf.clear();
    await this.router.navigate(['/']);
  }

  updateLeaderboard() {
    this.leaderboard = [];
    this.room.players.map((player) => {
      const playerArr = player.split('#');
      this.leaderboard.push({name: playerArr[0], score: playerArr[1]});
    });
    this.leaderboard.sort((a, b) => b.score - a.score);
  }

  getCurrentlyPlaying() {
    const self = this;
    setTimeout(async () => {
      self.currentlyPlaying = await self.spotifyService.apiCurrentlyPlaying(self.accessToken);
    }, 500);
  }

  pouchDbSync() {
    PouchDB.sync(this.pouchdb.localDbUrl, this.pouchdb.remoteDbUrl, {live: true, retry: true}).on('change', async (sync) => {
      await this.zone.run(async () => {
        console.log('--- SYNC --- ');
        const room: any = sync.change.docs[0];
        if (room._id === this.room._id) {
          this.room = room;
          this.updateLeaderboard();
          const accessToken = await this.ngf.getItem('accessToken');

          if (accessToken) {
            try {
              (room.isBuzzable) ? await this.spotifyService.apiPlaySpotify(accessToken) : await this.spotifyService.apiPauseSpotify(accessToken);
              this.getCurrentlyPlaying();
            } catch (e) {
              console.error(e);
            }
          }
        }
      });
    }).on('error', (err) => {
      console.error(err);
    });
  }
}
