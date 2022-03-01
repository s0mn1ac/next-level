import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  public onClickSignUpButton(): void {
    const name: string = this.signUpForm.get('name').value;
    const email: string = this.signUpForm.get('email').value;
    const password: string = this.signUpForm.get('password').value;
    this.authService.signUp(email, password, name);
  }

  private initForm(): void {
    this.signUpForm = this.formBuilder.group({
      name: new FormControl(null, Validators.compose([Validators.required])),
      email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      password: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(8)])),
      confirmPassword: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this.validateMatchingPasswords.bind(this)
      ]))
    });
  }

  private validateMatchingPasswords(formControl: FormControl): any {
    return formControl.value === this.signUpForm?.get('password')?.value ? null : { notMatchingPasswords: false };
  }

}
