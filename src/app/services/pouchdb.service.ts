import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import {NgForage} from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class PouchdbService {
  public localDB: PouchDB;
  public remoteDB: PouchDB;

  constructor(private readonly ngf: NgForage) {
    this.remoteDB = new PouchDB('http://134.209.240.247:5984/btwf');
    this.localDB = new PouchDB('btwf');
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

  async createRoom(username) {
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
    }).catch((err) => {
      console.log(err);
    });
  }

  syncPouch() {
    return new Promise((resolve, reject) => {
      PouchDB.sync(this.localDB, this.remoteDB, {live: true, retry: true}).on('change', (sync) => {
        console.log('--- SYNC ---');
        resolve(sync.change.docs[0]);
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  async getPouchdbDoc(documentId: string) {
    return new Promise( (resolve, reject) => {
      this.localDB.get(documentId)
        .then(pouchdbDoc => resolve(pouchdbDoc) )
        .catch(pouchdbError => reject(pouchdbError));
    });
  }
}
