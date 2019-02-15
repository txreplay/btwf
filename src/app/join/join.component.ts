import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  public form: FormGroup;
  private roomCode: string;

  constructor(private acRoute: ActivatedRoute, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.acRoute.params.subscribe((params) => {
      if (params.id) {
        this.roomCode = params.id;
      }
    });

    this.form = this.fb.group( {
      roomCode: new FormControl('')
    });
  }

  onSubmitJoin() {
    if (this.form.value.roomCode) {
      // API - Get room info
      this.roomCode = this.form.value.roomCode;
    }
  }

}
