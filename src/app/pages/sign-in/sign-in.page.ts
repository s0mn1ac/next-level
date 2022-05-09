import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public signInForm: FormGroup;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public async onClickSignInButton(): Promise<void> {
    await this.loadingService.show('signingUp');
    const email: string = this.signInForm.get('email').value;
    const password: string = this.signInForm.get('password').value;
    await this.authService.signIn(email, password);
    await this.loadingService.hide();
  }

  private initForm(): void {
    this.signInForm = new FormGroup({
      email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      password: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

}
