import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import {NgForage} from 'ngforage';

import {Room} from '../../models/room.model';
import {AuthService} from '../services/auth.service';
import {RoomService} from '../services/room.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [NgForage, AuthService, RoomService]
})
export class GameComponent implements OnInit {
  private action: 'join'|'create';

  private formCreateRoom: FormGroup;
  private formGetRoom: FormGroup;
  private formJoinRoom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    public auth: AuthService,
    public room: RoomService,
    private readonly ngf: NgForage,
  ) {
  }

  async ngOnInit() {
    this.generateForms();
    await this.retrieveSession();
  }

  setAction(action) {
    this.action = action;
  }

  async reset() {
    this.action = null;
    this.room.reset();
    this.auth.user = null;
    await this.ngf.clear();
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

  async retrieveSession() {
    this.auth.user = await this.ngf.getItem('user');
    this.room.roomName = await this.ngf.getItem('room');

    if (this.auth.user && this.room.roomName) {
      this.action = (this.auth.user.isAdmin) ? 'create' : 'join';
      await this.room.getOneRoomByName(this.room.roomName);
    }
  }

  async onSubmitCreateRoom() {
    const username = this.formCreateRoom.value.username;
    if (username) {
      await this.auth.anonymousLogin();
      const afsId = await this.auth.currentUserId();
      await this.room.createRoom(username, afsId);

      this.auth.user = {
        id: afsId,
        username,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.ngf.setItem('user', this.auth.user);
      await this.ngf.setItem('room', this.room.roomName);

      this.room.getOneRoomByName(this.room.roomName);
    }
  }

  async onSubmitJoinRoom() {
    const username = this.formJoinRoom.value.username;

    if (username) {
      const afsId = await this.auth.currentUserId();
      await this.addPlayer(username, afsId);

      this.auth.user = {
        id: afsId,
        username,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.ngf.setItem('user', this.auth.user);
    }
  }

  async onSubmitGetRoom() {
    const roomName = this.formGetRoom.value.roomName;

    if (roomName) {
      this.room.roomName = roomName;
      await this.auth.anonymousLogin();
      await this.ngf.setItem('room', roomName);
      await this.room.getOneRoomByName(roomName);
    }
  }

  addPlayer(username, afsId) {
    const document = this.afs.collection<Room>('rooms').doc(this.room.currRoom.id);

    return this.afs.firestore.runTransaction((transaction) => {
      return transaction.get(document.ref).then((doc) => {
        const data = doc.data();
        data.players.push(username + '#' + afsId);

        transaction.update(document.ref, {
          players: data.players,
          updatedAt: new Date()
        });
      });
    });
  }
}
