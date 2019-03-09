import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Room} from '../../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private $roomsCollection: AngularFirestoreCollection<any>;
  private $rooms: Observable<any>;

  private $roomCollection: AngularFirestoreCollection<any>;
  public $room: Observable<any>;
  public currRoom: any|Room;
  public roomName: string;

  constructor(private afs: AngularFirestore) {}

  static generateRoomName() {
    const LETTERS: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const roomNameLength = 5;

    let roomName = '';
    for (let i = 0; i < roomNameLength; i++) {
      roomName = roomName + LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    return roomName;
  }

  async createRoom(admin, afsId) {
    await this.getAllRooms();

    const id = this.afs.createId();
    this.roomName = RoomService.generateRoomName();

    const room: Room = {
      name: this.roomName,
      admin: admin + '#' + afsId,
      players: [admin + '#' + afsId],
      status: 'waitingPlayers',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.$roomsCollection.doc(id).set(room);
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
        console.log(id, ...data);

        return { id, ...data };
      }))
    );
  }

  reset() {
    this.$roomCollection = null;
    this.$rooms = null;
    this.$room = null;
    this.currRoom = null;
    this.roomName = null;
  }

}
