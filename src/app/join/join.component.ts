import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import {Room} from '../../models/room.model';
import {NgForage} from 'ngforage';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css'],
  providers: [NgForage]
})
export class JoinComponent implements OnInit {
  public formCode: FormGroup;
  public formPseudo: FormGroup;

  private $roomCollection: AngularFirestoreCollection<any>;
  private $room: Observable<any>;
  private room: any;
  private roomCode: string;
  private pseudoSubmitted: boolean;
  private isAdmin: boolean|null;

  constructor(private acRoute: ActivatedRoute, private fb: FormBuilder, private afs: AngularFirestore, private readonly ngf: NgForage) {
  }

  async ngOnInit() {
    this.acRoute.params.subscribe((params) => {
      if (params.id) {
        this.roomCode = params.id;
        this.getRoomDetails(params.id);
      }
    });

    this.formCode = this.fb.group( {
      roomCode: new FormControl('')
    });

    this.formPseudo = this.fb.group( {
      pseudo: new FormControl('')
    });

    const pseudo = await this.ngf.getItem('pseudo');
    this.pseudoSubmitted = !!(pseudo);

    this.isAdmin  = await this.ngf.getItem('admin');
  }

  onSubmitCode() {
    if (this.formCode.value.roomCode) {
      this.getRoomDetails(this.formCode.value.roomCode);
    }
  }

  getRoomDetails(roomCode) {
    this.$roomCollection = this.afs
      .collection<Room>('rooms', ref => ref
      .where('code', '==', roomCode)
      .limit(1));

    this.$room = this.$roomCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        console.log('aaa');
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        this.room = {id, ...data};

        return { id, ...data };
      }))
    );

    this.roomCode = roomCode;
  }

  onSubmitPseudo() {
    if (this.formPseudo.value.pseudo) {
      const document = this.afs.collection<Room>('rooms').doc(this.room.id);

      return this.afs.firestore.runTransaction((transaction) => {
        return transaction.get(document.ref).then((doc) => {
          const data = doc.data();
          data.players.push(this.formPseudo.value.pseudo);

          transaction.update(document.ref, {
            players: data.players,
          });

          this.pseudoSubmitted = true;
        });
      });
    }
  }

  startGame() {
    console.log('start');
  }
}
