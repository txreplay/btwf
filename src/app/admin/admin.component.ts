import { Component, OnInit } from '@angular/core';

import {User} from '../../models/user.model';
import SpotifyWebApi from 'spotify-web-api-js';
import {SpotifyService} from '../services/spotify.service';
import {PouchdbService} from '../services/pouchdb.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: []
})
export class AdminComponent implements OnInit {
  public accessToken: string;
  public user: any;
  public room: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public spotify: SpotifyService,
    public pouchdb: PouchdbService,
  ) {

  }

  async ngOnInit() {
    const roomName = this.route.snapshot.paramMap.get('id');
    this.pouchdb.getRoomByName('room#' + roomName).then(async (room) => {
      this.user = await this.pouchdb.getUser();

      console.log(this.room);
      console.log(this.user);

      if (this.room.admin !== this.user.username) {
        this.router.navigate(['homepage']);
      }
    }).catch(() => {
      this.router.navigate(['homepage']);
    });

    // this.ngf.getItem('accessToken').then((accessToken: any) => {
    //   this.accessToken = accessToken;
    // });
  }

  spotifyConnect() {
    // this.spotify.apiGetToken().subscribe(async (result: any) => {
    //   this.accessToken = result;
    //   await this.ngf.setItem('accessToken', result);
    // });
  }

  search() {
    // this.spotify.search('booba', this.accessToken).subscribe((result) => {
    //   console.log(result);
    // });
  }

}
