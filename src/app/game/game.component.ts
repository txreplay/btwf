import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import {NgForage} from 'ngforage';

import {AuthService} from '../services/auth.service';
import {RoomService} from '../services/room.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [NgForage]

})
export class GameComponent implements OnInit {

  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
    public room: RoomService,
    private readonly ngf: NgForage,
  ) { }

  async ngOnInit() {
    console.log(this.room);
    console.log(this.auth);
  }

}
