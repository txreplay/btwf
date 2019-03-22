import { Component, OnInit } from '@angular/core';


import {User} from '../../models/user.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: []

})
export class GameComponent implements OnInit {
  public user: User;

  constructor(
    // private afs: AngularFirestore,
    // public auth: AuthService,
    // public room: RoomService,
    // private readonly ngf: NgForage,
  ) {

  }

  async ngOnInit() {
    // await this.ngf.getItem('user').then((user: any) => {
    //   this.user = user;
    // });
    //
    // await this.ngf.getItem('room').then(async (room: any) => {
    //   await this.room.getOneRoomByName(room);
    // });
    //
    // console.log(this.room);
    // console.log(this.auth);
    // console.log(this.user);
  }

  buzz() {

  }

}
