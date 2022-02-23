import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  public changeUserForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.changeUserForm = this.formBuilder.group({
      name: new FormControl('Fulanito Fulánez Fulánez', Validators.compose([Validators.required, Validators.nullValidator])),
      user: new FormControl('fulanito', Validators.compose([Validators.required, Validators.nullValidator]))
    });
  }

}
