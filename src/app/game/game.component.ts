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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pouchdb: PouchdbService,
    private zone: NgZone
  ) {
    this.roomName = this.route.snapshot.paramMap.get('id');
    this.pouchDbSync();
  }

  async ngOnInit() {
    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    this.user = await this.pouchdb.getUser();
  }

  async buzz() {
    await this.pouchdb.changeBuzzabilityStatus(false, this.roomName);
  }

  pouchDbSync() {
    PouchDB.sync(this.pouchdb.localDbUrl, this.pouchdb.remoteDbUrl, this.pouchdb.options).on('change', async (sync) => {
      this.zone.run(() => {
        console.log('--- SYNC --- ');
        this.room = sync.change.docs[0];
      });
    }).on('error', (err) => {
      console.error(err);
    });
  }
}
