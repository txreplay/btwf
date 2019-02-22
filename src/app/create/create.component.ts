import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {NgForage} from 'ngforage';


import {Room} from '../../models/room.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NgForage]
})
export class CreateComponent implements OnInit {
  public form: FormGroup;
  private rooms: any;
  private $rooms: Observable<any>;
  private $roomsCollection: AngularFirestoreCollection<any>;


  constructor(private fb: FormBuilder, private router: Router, private afs: AngularFirestore, private readonly ngf: NgForage) { }

  ngOnInit() {
    this.form = this.fb.group( {
      // type: new FormControl(''),
      pseudo: new FormControl('')
    });

    this.getAllRooms();
  }

  getAllRooms() {
    this.$roomsCollection = this.afs.collection<Room>('rooms');

    this.$rooms = this.$roomsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        this.rooms = {id, ...data};

        return { id, ...data };
      }))
    );
  }

  async createRoom(type, name) {
    const id = this.afs.createId();
    const room: any = {
      type,
      admin: name,
      code: 'XPOVX',
      players: [name]
    };
    await this.$roomsCollection.doc(id).set(room);
  }

  async onSubmitCreate() {
    const formValue = this.form.value;
    formValue.type = 'solo';

    if (formValue.type) {
      await this.createRoom(formValue.type, formValue.pseudo);

      await this.ngf.setItem('pseudo', formValue.pseudo);
      await this.ngf.setItem('admin', true);

      await this.router.navigate(['join', 'XPOVX']);
    }
  }
}
