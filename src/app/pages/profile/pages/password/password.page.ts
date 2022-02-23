import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  public changePasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      newPassword: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      confirmPassword: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this.validateMatchingPasswords.bind(this)
      ]))
    });
  }

  private validateMatchingPasswords(formControl: FormControl): any {
    console.log(formControl.value);
    return formControl.value === this.changePasswordForm?.get('newPassword')?.value ? null : { notMatchingPasswords: false };
  }

}
