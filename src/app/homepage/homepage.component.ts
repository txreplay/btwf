import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {PouchdbService} from '../services/pouchdb.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  public action: 'join'|'create';
  public error: string;

  private formCreateRoom: FormGroup;
  private formGetRoom: FormGroup;
  private formJoinRoom: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public pouchdb: PouchdbService
  ) {
  }

  async ngOnInit() {
    this.generateForms();
    // await this.retrieveSession();
  }

  setAction(action) {
    this.action = action;
  }

  async reset() {
    this.action = null;
    this.error = null;
    this.formCreateRoom.reset();
    this.formGetRoom.reset();
    this.formJoinRoom.reset();
    // await this.ngf.clear();
  }

  generateForms() {
    this.formCreateRoom = this.fb.group( {
      username: [null, Validators.required]
    });

    this.formGetRoom = this.fb.group( {
      roomName: [null, Validators.required]
    });

    this.formJoinRoom = this.fb.group( {
      username: [null, Validators.required]
    });
  }

  async onSubmitCreateRoom() {
    const username = this.formCreateRoom.value.username;

    if (username) {
      const room = this.pouchdb.createRoom(username);
      await this.pouchdb.createUser(username, true, room._id);
      const roomName = room._id.split('#');

      this.router.navigate(['admin', {id: roomName[1]}]);
    }
  }

  async onSubmitGetRoom() {
    const roomName = this.formGetRoom.value.roomName;

    if (roomName) {
      this.pouchdb.getRoomByName(roomName);
      // Check if enough players
      // Check if status is ready
    }
  }

  async onSubmitJoinRoom() {
    const username = this.formJoinRoom.value.username;
    const roomName = '';

    if (username) {
      this.pouchdb.createUser(username, false, roomName);

      this.pouchdb.userJoinRoom(username, roomName);
      await this.router.navigate(['/game']);
    }
  }

  async startGame() {
    // this.room.getOneRoomByName(this.room.roomName);
    //
    // if (this.room.currRoom.players.length >= 3) {
    //   await this.changeStatus();
    // }
  }

  addPlayer(username, afsId) {
    // const document = this.afs.collection<Room>('rooms').doc(this.room.currRoom.id);
    //
    // return this.afs.firestore.runTransaction((transaction) => {
    //   return transaction.get(document.ref).then((doc) => {
    //     const data = doc.data();
    //     data.players.push(username + '#' + afsId);
    //
    //     transaction.update(document.ref, {
    //       players: data.players,
    //       updatedAt: new Date()
    //     });
    //   });
    // });
  }

  changeStatus() {
    // const document = this.afs.collection<Room>('rooms').doc(this.room.currRoom.id);
    //
    // return this.afs.firestore.runTransaction((transaction) => {
    //   return transaction.get(document.ref).then((doc) => {
    //     const data = doc.data();
    //
    //     console.log(data.status);
    //     if (data.status === 'waitingPlayers') {
    //       data.status = 'inGame';
    //
    //       transaction.update(document.ref, {
    //         status: data.status,
    //         updatedAt: new Date()
    //       });
    //     }
    //   });
    // }).then(async () => {
    //   await this.router.navigate(['/admin']);
    // });
  }
}
