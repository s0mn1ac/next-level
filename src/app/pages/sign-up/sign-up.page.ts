import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public signUpForm: FormGroup;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public async onClickSignUpButton(): Promise<void> {
    await this.loadingService.show('signingUp');
    const name: string = this.signUpForm.get('name').value;
    const email: string = this.signUpForm.get('email').value;
    const password: string = this.signUpForm.get('password').value;
    await this.authService.signUp(email, password, name);
    await this.loadingService.hide();
  }

  private initForm(): void {
    this.signUpForm = new FormGroup({
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
