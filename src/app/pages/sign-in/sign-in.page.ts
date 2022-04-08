import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public signInForm: FormGroup;

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

  public async onClickSignInButton(): Promise<void> {
    this.loading.present();
    const email: string = this.signInForm.get('email').value;
    const password: string = this.signInForm.get('password').value;
    await this.authService.signIn(email, password);
    this.loading.dismiss();
  }

  private initForm(): void {
    this.signInForm = this.formBuilder.group({
      email: new FormControl('test1@nextlevel.com', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('12345678', Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

  private async initLoadingScreen(): Promise<void> {
    this.loading = await this.loadingController.create({
      message: this.translocoService.translate('loadingScreens.signingIn'),
      mode: 'ios'
    });
  }

}
