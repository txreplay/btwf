import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import PouchDB from 'pouchdb-browser';

import {PouchdbService} from '../services/pouchdb.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  public action: 'join'|'create';
  public error: string;

  public roomName: string;
  public user: {};

  private formCreateRoom: FormGroup;
  private formGetRoom: FormGroup;
  private formJoinRoom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private zone: NgZone,
    private pouchdb: PouchdbService,
  ) {}

  async ngOnInit() {
    this.pouchDbSync();
    this.generateForms();
  }

  setAction(action) {
    this.action = action;
  }

  generateForms() {
    this.formCreateRoom = this.fb.group( {username: [null, Validators.required]});
    this.formGetRoom = this.fb.group( {roomName: [null, Validators.required]});
    this.formJoinRoom = this.fb.group( {username: [null, Validators.required]});
  }

  async onSubmitCreateRoom() {
    const username = this.formCreateRoom.value.username;

    if (username) {
      const room: any = await this.pouchdb.createRoom(username);
      await this.pouchdb.createUser(username, true, room._id);

      await this.router.navigate(['admin', {id: room._id}]);
    }
  }

  async onSubmitGetRoom() {
    let roomName = this.formGetRoom.value.roomName;

    if (roomName) {
      roomName = roomName.toUpperCase();
      await this.pouchdb.getPouchdbDoc(roomName).then(async (room: any) => {
        console.log(room);
        if (room.status !== 'waiting') {
          this.error = 'Partie déjà commencée ou terminée';
        } else {
          this.roomName = roomName;
        }
      }).catch((e) => {
        console.error(e);
        this.error = 'Ce salon n\'existe pas.';
      });

    }
  }

  async onSubmitJoinRoom() {
    const username = this.formJoinRoom.value.username;

    if (!username.includes('#') && username) {
      await this.pouchdb.createUser(username, false, this.roomName);
      await this.pouchdb.userJoinRoom(username, this.roomName);

      await this.router.navigate(['game', {id: this.roomName}]);
    } else {
      this.error = 'Votre pseudo ne doit pas contenir le symbole "#"';
    }
  }

  pouchDbSync() {
    PouchDB.sync(this.pouchdb.localDbUrl, this.pouchdb.remoteDbUrl, {live: true, retry: true}).on('change', async (sync) => {
      await this.zone.run(async () => {
        console.log('--- SYNC --- ');
      });
    }).on('error', (err) => {
      console.log(err);
    });
  }
}
