import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public signInForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  public onClickSignInButton(): void {
    const email: string = this.signInForm.get('email').value;
    const password: string = this.signInForm.get('password').value;
    this.authService.signIn(email, password);
  }

  private initForm(): void {
    this.signInForm = this.formBuilder.group({
      email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      password: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

}
