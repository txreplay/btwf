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
  public user: any;
  public roomName: string;

  private formCreateRoom: FormGroup;
  private formGetRoom: FormGroup;
  private formJoinRoom: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public pouchdb: PouchdbService,

  ) {}

  async ngOnInit() {
    this.generateForms();
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
    this.formCreateRoom = this.fb.group( {username: [null, Validators.required]});
    this.formGetRoom = this.fb.group( {roomName: [null, Validators.required]});
    this.formJoinRoom = this.fb.group( {username: [null, Validators.required]});
  }

  async onSubmitCreateRoom() {
    const username = this.formCreateRoom.value.username;

    if (username) {
      const room: any = await this.pouchdb.createRoom(username);
      console.log(room);
      await this.pouchdb.createUser(username, true, room._id);

      await this.router.navigate(['admin', {id: room._id}]);
    }
  }

  async onSubmitGetRoom() {
    const roomName = this.formGetRoom.value.roomName;

    if (roomName) {
      await this.pouchdb.getPouchdbDoc(roomName).then(async (room: any) => {
        if (room.status !== 'waiting') {
          this.error = 'Partie déjà commencée ou terminée';
        }

        this.roomName = roomName;
      }).catch(() => {
        this.error = 'Ce salon n\'existe pas.';
      });

    }
  }

  async onSubmitJoinRoom() {
    const username = this.formJoinRoom.value.username;

    if (username) {
      await this.pouchdb.createUser(username, false, this.roomName);
      this.pouchdb.userJoinRoom(username, this.roomName);

      await this.router.navigate(['game', {id: this.roomName}]);
    }
  }
}
