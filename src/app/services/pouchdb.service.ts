import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {NgForage} from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class PouchdbService {
  public localDB: PouchDB;
  public remoteDB: PouchDB;

  constructor(private readonly ngf: NgForage) {
    this.localDB = new PouchDB('http://134.209.240.247:5984/btwf');
    this.remoteDB = new PouchDB('btwf');

    this.localDB.sync(this.remoteDB).on('change', () => {
      console.log('--- SYNC ---');
    }).on('error', (err) => {
      console.error(err);
    });
  }

  static generateId() {
    const LETTERS: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const roomNameLength = 5;

    let roomName = '';
    for (let i = 0; i < roomNameLength; i++) {
      roomName = roomName + LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    return roomName;
  }

  // ROOM

  createRoom(username) {
    const doc = {
      _id: PouchdbService.generateId(),
      admin: username,
      status: 'waiting',
      isBuzzable: false,
      players: [username]
    };

    this.localDB.put(doc);

    return doc;
  }

  async getRoomByName(roomName) {
    return new Promise((resolve, reject) => {
      this.localDB.get(roomName).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // USER

  async createUser(username, admin, room) {
    const doc = {
      username,
      admin,
      room
    };

    await this.ngf.setItem('user', doc);
  }

  async getUser() {
    return await this.ngf.getItem('user');
  }

  userJoinRoom(username, roomName) {
    const self = this;

    this.localDB.get(roomName).then((doc) => {
      doc.players.push(username);

      return self.localDB.put({
        _id: roomName,
        _rev: doc._rev,
        admin: doc.admin,
        status: doc.status,
        isBuzzable: doc.isBuzzable,
        players: doc.players
      });
    }).then((response) => {
      console.log(response);
    }).catch( (err) => {
      console.log(err);
    });
  }
}
