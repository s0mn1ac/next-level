import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.initForm();
    this.checkIsLoggedIn();
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

  private checkIsLoggedIn(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/board']);
      return;
    }
    this.loadingService.hideLoadingScreen();
  }

}
