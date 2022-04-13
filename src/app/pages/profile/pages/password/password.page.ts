import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  public changePasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public async onClickChangePassword(): Promise<void> {
    await this.loadingService.show('updatingPassword');
    const currentPassword: string = this.changePasswordForm.get('currentPassword').value;
    const newPassword: string = this.changePasswordForm.get('newPassword').value;
    await this.authService.updatePassword(currentPassword, newPassword);
    await this.loadingService.hide();
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
    return formControl.value === this.changePasswordForm?.get('newPassword')?.value ? null : { notMatchingPasswords: false };
  }

}
