import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {PouchdbService} from '../services/pouchdb.service';
import {NgForage} from 'ngforage';

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
    private readonly ngf: NgForage
  ) {
    this.roomName = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit() {
    this.room = await this.pouchdb.getPouchdbDoc(this.roomName);
    this.room = await this.pouchdb.syncPouch();
    this.user = await this.pouchdb.getUser();
  }

  buzz() {

  }

}
