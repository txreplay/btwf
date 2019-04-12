import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {PouchdbService} from '../services/pouchdb.service';
import PouchDB from 'pouchdb-browser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: []

})
export class GameComponent implements OnInit {
  public user: any;
  public roomName: any;
  public room: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public pouchdb: PouchdbService,
    private zone: NgZone
  ) {
    this.roomName = this.route.snapshot.paramMap.get('id');

    this.pouchDbSync();
  }

  async ngOnInit() {
    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    console.log(this.room);
    this.user = await this.pouchdb.getUser();
  }

  async buzz() {
    await this.pouchdb.changeBuzzabilityStatus(false, this.roomName);
  }

  pouchDbSync() {
    PouchDB.sync(this.pouchdb.localDB, this.pouchdb.remoteDB, {live: true, retry: true}).on('change', async (sync) => {
      this.zone.run(() => {
        console.log('--- SYNC --- ');
        this.room = sync.change.docs[0];
      });
    }).on('error', (err) => {
      console.log(err);
    });
  }
}
