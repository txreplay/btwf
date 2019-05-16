import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import PouchDB from 'pouchdb-browser';

import {PouchdbService} from '../services/pouchdb.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public roomName: any;
  public room: any;
  public user: any;
  public leaderboard: Array<any> = [];
  public emoji: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pouchdb: PouchdbService,
    private zone: NgZone
  ) {
    this.roomName = this.route.snapshot.paramMap.get('id');
    this.emoji = this.pouchdb.getEmojiFromAnimal(this.roomName);
    this.pouchDbSync();
  }

  async ngOnInit() {
    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    this.user = await this.pouchdb.getUser();
    this.updateLeaderboard();
  }

  async buzz() {
    await this.pouchdb.changeBuzzabilityStatus(false, this.user.username, this.roomName);
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
    try {
      PouchDB.sync(this.pouchdb.localDbUrl, this.pouchdb.remoteDbUrl, this.pouchdb.options).on('change', async (sync) => {
        this.zone.run(() => {
          console.log('--- SYNC --- ');
          const room: any = sync.change.docs[0];
          if (room._id === this.room._id) {
            this.room = room;
            this.updateLeaderboard();
          }
        });
      }).on('error', (err) => {
        console.error(err);
        this.pouchDbSync();
      });
    } catch (e) {
      this.pouchDbSync();
    }
  }
}
