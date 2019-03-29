import {Component, OnInit} from '@angular/core';
import {PouchdbService} from './services/pouchdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public pouchdb: PouchdbService) {

  }

  async ngOnInit() {
    await this.pouchdb.syncPouch();
  }

}
