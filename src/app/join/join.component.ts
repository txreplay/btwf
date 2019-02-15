import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import {RoomModel} from '../../models/room.model';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  public formCode: FormGroup;
  public formPseudo: FormGroup;
  private afs: AngularFirestore;

  private $roomCollection: AngularFirestoreCollection<any>;
  private $room: Observable<any>;
  private room: any;
  private roomCode: string;
  private pseudoSubmitted: boolean;

  constructor(private acRoute: ActivatedRoute, private fb: FormBuilder, private afs: AngularFirestore) {
  }

  ngOnInit() {
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
  }

  onSubmitCode() {
    if (this.formCode.value.roomCode) {
      this.getRoomDetails(this.formCode.value.roomCode);
    }
  }

  getRoomDetails(roomCode) {
    this.$roomCollection = this.afs
      .collection<RoomModel>('rooms', ref => ref
      .where('code', '==', roomCode)
      .limit(1));

    this.$room = this.$roomCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
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
      const document = this.afs.collection<RoomModel>('rooms').doc(this.room.id);

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
}
