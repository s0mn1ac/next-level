import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {

  public changeEmailForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.changeEmailForm = this.formBuilder.group({
      newEmailAddress: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      confirmPassword: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

}
