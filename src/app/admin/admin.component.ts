import { Component, OnInit } from '@angular/core';

import SpotifyWebApi from 'spotify-web-api-js';
import {SpotifyService} from '../services/spotify.service';
import {PouchdbService} from '../services/pouchdb.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForage} from 'ngforage';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: []
})
export class AdminComponent implements OnInit {
  public accessToken: string;
  public user: any;
  public roomName: any;
  public room: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public spotify: SpotifyService,
    public pouchdb: PouchdbService,
    private readonly ngf: NgForage
  ) {
    this.roomName = this.route.snapshot.paramMap.get('id');
    this.room = this.pouchdb.getRoomByName(this.roomName);

  }

  async ngOnInit() {
    this.room.then(async (room: any) => {
      this.user = await this.pouchdb.getUser();

      console.log(room);
      console.log(this.user);

      if (room.admin !== this.user.username) {
        this.router.navigate(['homepage']);
      }
    }).catch(() => {
      this.router.navigate(['homepage']);
    });

    this.ngf.getItem('accessToken').then((accessToken: any) => {
      this.accessToken = accessToken;
    });
  }

  spotifyConnect() {
    this.spotify.apiGetToken().subscribe(async (result: any) => {
      this.accessToken = result;
      await this.ngf.setItem('accessToken', result);
    });
  }

  search() {
    this.spotify.search('booba', this.accessToken).subscribe((result) => {
      console.log(result);
    });
  }

}
