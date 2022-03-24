import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import firebase from 'firebase/compat/app';
import { LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { ErrorCodesConfig } from 'src/app/shared/strings/error-codes.config';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public signUpForm: FormGroup;

  private loading: HTMLIonLoadingElement;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private translocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initLoadingScreen();
  }

  public async onClickSignUpButton(): Promise<void> {
    await this.initLoadingScreen();
    this.loading.present();
    const name: string = this.signUpForm.get('name').value;
    const email: string = this.signUpForm.get('email').value;
    const password: string = this.signUpForm.get('password').value;
    await this.authService.signUp(email, password, name);
    this.loading.dismiss();
  }

  private initForm(): void {
    this.signUpForm = this.formBuilder.group({
      name: new FormControl('Test2', Validators.compose([Validators.required])),
      email: new FormControl('test2@nextlevel.com', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('12345678', Validators.compose([Validators.required, Validators.minLength(8)])),
      confirmPassword: new FormControl('12345678', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this.validateMatchingPasswords.bind(this)
      ]))
    });
  }

  private validateMatchingPasswords(formControl: FormControl): any {
    return formControl.value === this.signUpForm?.get('password')?.value ? null : { notMatchingPasswords: false };
  }

  private async initLoadingScreen(): Promise<void> {
    this.loading = await this.loadingController.create({
      message: this.translocoService.translate('loadingScreens.signingUp')
    });
  }

}
