import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import {NgForage} from 'ngforage';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import {Room, Room} from '../../models/room.model';
import {User} from '../../models/user.model';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [NgForage, AuthService]
})
export class GameComponent implements OnInit {
  private action: 'join'|'create';

  private formCreateRoom: FormGroup;
  private formGetRoom: FormGroup;
  private formJoinRoom: FormGroup;

  private $roomsCollection: AngularFirestoreCollection<any>;
  private $rooms: Observable<any>;

  private $roomCollection: AngularFirestoreCollection<any>;
  private $room: Observable<any>;
  private currRoom: any|Room;
  private roomName: string;

  private user: User;

  constructor(
    private acRoute: ActivatedRoute,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private auth: AuthService,
    private readonly ngf: NgForage,
  ) {}

  static generateRoomName() {
    const LETTERS: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const roomNameLength = 5;

    let roomName = '';
    for (let i = 0; i < roomNameLength; i++) {
      roomName = roomName + LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    return roomName;
  }

  async ngOnInit() {
    this.generateForms();
  }

  setAction(action) {
    this.action = action;
  }

  cancelAction() {
    this.action = null;
    this.$roomCollection = null;
    this.$room = null;
    this.currRoom = null;
    this.roomName = null;
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

  getAllRooms() {
    this.$roomsCollection = this.afs.collection<Room>('rooms');

    this.$rooms = this.$roomsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );
  }

  getOneRoomByName(roomName: string) {
    this.$roomCollection = this.afs
      .collection<Room>('rooms', ref => ref
      .where('name', '==', roomName)
      .limit(1));

    this.$room = this.$roomCollection.snapshotChanges().pipe(
      map(actions => actions.map( a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        this.currRoom = { id, ...data };

        return { id, ...data };
      }))
    );
  }

  async onSubmitCreateRoom() {
    const username = this.formCreateRoom.value.username;
    if (username) {
      await this.auth.anonymousLogin();
      await this.createRoom(username);
      this.user = {
        username,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await this.ngf.setItem('user', this.user);
      this.getOneRoomByName(this.roomName);
    }
  }

  async onSubmitJoinRoom() {
    const username = this.formJoinRoom.value.username;
    if (username) {
      await this.addPlayer(username);
      this.user = {
        username,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await this.ngf.setItem('user', this.user);

    }
  }

  async onSubmitGetRoom() {
    const roomName = this.formGetRoom.value.roomName;
    if (roomName) {
      await this.getOneRoomByName(roomName);
    }
  }

  async createRoom(admin) {
    await this.getAllRooms();

    const id = this.afs.createId();
    this.roomName = GameComponent.generateRoomName();

    const room: Room = {
      name: this.roomName,
      admin,
      players: [admin],
      status: 'waitingPlayers',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.$roomsCollection.doc(id).set(room);
  }

  addPlayer(username) {
    const document = this.afs.collection<RoomModel>('rooms').doc(this.currRoom.id);

    return this.afs.firestore.runTransaction((transaction) => {
      return transaction.get(document.ref).then((doc) => {
        const data = doc.data();
        data.players.push(username);

        transaction.update(document.ref, {
          players: data.players,
          updatedAt: new Date()
        });
      });
    });
  }
}
