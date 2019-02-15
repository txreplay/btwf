import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import {RoomModel} from '../../models/room.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public form: FormGroup;
  private rooms: any;
  private $rooms: Observable<any>;
  private $roomsCollection: AngularFirestoreCollection<any>;


  constructor(private fb: FormBuilder, private router: Router, private afs: AngularFirestore) { }

  ngOnInit() {
    this.form = this.fb.group( {
      // type: new FormControl(''),
      pseudo: new FormControl('')
    });

    this.getAllRooms();
  }

  getAllRooms() {
    this.$roomsCollection = this.afs.collection<RoomModel>('rooms');

    this.$rooms = this.$roomsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        this.rooms = {id, ...data};

        return { id, ...data };
      }))
    );
  }

  createRoom(type, name) {
    const id = this.afs.createId();
    const room: any = {
      type,
      admin: name,
      code: 'SCXP',
      players: [name]
    };
    this.$roomsCollection.doc(id).set(room);
  }

  onSubmitCreate() {
    const formValue = this.form.value;
    formValue.type = 'solo';

    if (formValue.type) {
      this.createRoom(formValue.type, formValue.pseudo);

      this.router.navigate(['join', 'OPJS']);
    }
  }
}
