import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group( {
      type: new FormControl('')
    });
  }

  onSubmitCreate() {
    const formValue = this.form.value;

    if (formValue.type) {
      // API - Create Room / Return roomCode
      const apiRes = {
        roomCode: 'AI2J4Q'
      };

      this.router.navigate(['join', apiRes.roomCode]);
    }
  }
}
