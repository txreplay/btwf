import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import {NgForage} from 'ngforage';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PouchdbService {
  public localDb: any;
  public remoteDb: any;
  public localDbUrl: string;
  public remoteDbUrl: string;
  public options: {};

  constructor(private readonly ngf: NgForage) {
    this.localDbUrl = environment.localPouchDbUrl;
    this.remoteDbUrl = environment.remotePouchDbUrl;
    this.localDb = new PouchDB(environment.localPouchDbUrl);
    this.remoteDb = new PouchDB(environment.remotePouchDbUrl);
    this.options = {live: true, retry: true};
  }

  static getAnimal() {
    const ANIMALS: Array<string> = [
      'chien',
      'hamster',
      'lapin',
      'renard',
      'ours',
      'panda',
      'koala',
      'tigre',
      'lion',
      'cochon',
      'grenouille',
      'singe',
      'poule',
      'pingouin',
      'oiseau',
      'poussin',
      'hibou',
      'loup',
      'licorne',
      'cheval',
      'coccinelle',
      'moustique',
      'araignée',
      'tortue',
      'serpent',
      'scorpion',
      'crabe',
      'pieuvre',
      'homard',
      'poisson',
      'dauphin',
      'baleine',
      'abeille',
      'chenille',
      'papillon',
      'coquillage',
      'cochon',
      'lama',
      'dinde',
      'paon',
      'perroquet',
      'cygne',
      'lapin',
      'blaireau',
      'rat',
      'dragon',
    ];
    return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  }

  getEmojiFromAnimal(animal) {
    const emojis = {
      chien: '🐶',
      hamster: '🐹',
      lapin: '🐰',
      renard: '🦊',
      ours: '🐻',
      panda: '🐼',
      koala: '🐨',
      tigre: '🐯',
      lion: '🦁',
      cochon: '🐷',
      grenouille: '🐸',
      singe: '🐵',
      poule: '🐔',
      pingouin: '🐧',
      oiseau: '🐦',
      poussin: '🐥',
      hibou: '🦉',
      loup: '🐺',
      licorne: '🦄',
      cheval: '🐴',
      coccinelle: '🐞',
      moustique: '🦟',
      tortue: '🐢',
      serpent: '🐍',
      scorpion: '🦂',
      crabe: '🦀',
      pieuvre: '🐙',
      homard: '🦞',
      poisson: '🐟',
      dauphin: '🐬',
      baleine: '🐋',
      abeille: '🐝',
      chenille: '🐛',
      papillon: '🦋',
      coquillage: '🐚',
      cochon: '🐖',
      lama: '🦙',
      dinde: '🦃',
      paon: '🦚',
      perroquet: '🦜',
      cygne: '🦢',
      lapin: '🐇',
      blaireau: '🦡',
      rat: '🐀',
      dragon: '🐉'
    };

    return emojis[animal] + emojis[animal];
  }

  async generateId() {
    const animal = PouchdbService.getAnimal();
    await this.cleanRooms();

    return animal;
  }

  async cleanRooms() {
    return new Promise( (resolve, reject) => {
      this.localDb.allDocs({include_docs: true})
        .then(async (pouchdbDocs) => {
          for (const room of pouchdbDocs.rows) {
            await this.removeRoom(room.doc);
          }
          resolve();
        })
        .catch(pouchdbError => reject(pouchdbError));
    });
  }

  async getPouchdbDoc(documentId: string) {
    return new Promise( (resolve, reject) => {
      this.localDb.get(documentId)
        .then(pouchdbDoc => resolve(pouchdbDoc) )
        .catch(pouchdbError => reject(pouchdbError));
    });
  }

  async createRoom(username: string) {
    const roomName = await this.generateId();

    const doc = {
      _id: roomName,
      admin: username,
      status: 'waiting',
      isBuzzable: false,
      lastBuzzer: '',
      players: [],
      createdAt: new Date()
    };

    await this.localDb.put(doc);

    return doc;
  }

  async createUser(username: string, admin: boolean, room: string) {
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

  removeRoom(room: any) {
    return new Promise( (resolve, reject) => {
      const createdRoom = new Date(room.createdAt);
      const dateNow = new Date();
      dateNow.setHours(dateNow.getHours() - 3);
      if (room.status === 'done' || createdRoom < dateNow) {
        resolve(this.localDb.remove(room));
      } else {
        resolve();
      }
    });
  }

  resetLastBuzzer(roomName: string) {
    return new Promise((resolve, reject) => {
      const self = this;

      this.localDb.get(roomName).then((doc) => {

        return self.localDb.put({
          _id: roomName,
          _rev: doc._rev,
          admin: doc.admin,
          status: doc.status,
          isBuzzable: doc.isBuzzable,
          lastBuzzer: '',
          players: doc.players,
          createdAt: doc.createdAt
        });
      }).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  userJoinRoom(username: string, roomName: string) {
    return new Promise((resolve, reject) => {
      const self = this;

      this.localDb.get(roomName).then((doc) => {
        doc.players.push(username + '#0');

        return self.localDb.put({
          _id: roomName,
          _rev: doc._rev,
          admin: doc.admin,
          status: doc.status,
          isBuzzable: doc.isBuzzable,
          lastBuzzer: doc.lastBuzzer,
          players: doc.players,
          createdAt: doc.createdAt
        });
      }).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  addPointToPlayer(nbPoints: number, lastBuzzer: string, roomName: string) {
    return new Promise((resolve, reject) => {
      const self = this;

      this.localDb.get(roomName).then((doc) => {
        for (const item of doc.players) {
          const playerScoreSplit = item.split('#');
          const playerName = playerScoreSplit[0];

          if (lastBuzzer === playerName) {
            const newScore = parseInt(playerScoreSplit[1], 10) + nbPoints;
            const index = doc.players.indexOf(item);
            doc.players.splice(index, 1);
            doc.players.push(playerName + '#' + newScore);
            break;
          }
        }


        return self.localDb.put({
          _id: roomName,
          _rev: doc._rev,
          admin: doc.admin,
          status: doc.status,
          isBuzzable: doc.isBuzzable,
          lastBuzzer: doc.lastBuzzer,
          players: doc.players,
          createdAt: doc.createdAt
        });
      }).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  changeBuzzabilityStatus(isBuzzable: boolean, username: string, roomName: string) {
    return new Promise((resolve, reject) => {
      const self = this;

      this.localDb.get(roomName).then((doc) => {
        doc.isBuzzable = isBuzzable;
        if (!isBuzzable) {
          doc.lastBuzzer = username;
        }

        return self.localDb.put({
          _id: roomName,
          _rev: doc._rev,
          admin: doc.admin,
          status: doc.status,
          isBuzzable: doc.isBuzzable,
          lastBuzzer: doc.lastBuzzer,
          players: doc.players,
          createdAt: doc.createdAt
        });
      }).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  changeRoomStatus(status: string, roomName: string) {
    return new Promise((resolve, reject) => {
      const self = this;

      this.localDb.get(roomName).then((doc) => {
        doc.status = (status);

        return self.localDb.put({
          _id: roomName,
          _rev: doc._rev,
          admin: doc.admin,
          status: doc.status,
          isBuzzable: doc.isBuzzable,
          lastBuzzer: doc.lastBuzzer,
          players: doc.players,
          createdAt: doc.createdAt
        });
      }).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
