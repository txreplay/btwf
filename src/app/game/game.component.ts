import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import {NgForage} from 'ngforage';

import {AuthService} from '../services/auth.service';
import {RoomService} from '../services/room.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [NgForage]

})
export class GameComponent implements OnInit {
  private user: User;

  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
    public room: RoomService,
    private readonly ngf: NgForage,
  ) {

  }

  async ngOnInit() {
    await this.ngf.getItem('user').then((user) => {
      this.user = user;
    });

    await this.ngf.getItem('room').then(async (room) => {
      await this.room.getOneRoomByName(room);
    });

    console.log(this.room);
    console.log(this.auth);
    console.log(this.user);
  }

  buzz() {

  }

}
