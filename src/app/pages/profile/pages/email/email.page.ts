import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {

  public changeEmailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public async onClickChangeEmail(): Promise<void> {
    await this.loadingService.show('updatingEmail');
    const newEmailAddress: string = this.changeEmailForm.get('newEmailAddress').value;
    const confirmPassword: string = this.changeEmailForm.get('confirmPassword').value;
    await this.authService.updateEmail(newEmailAddress, confirmPassword);
    await this.loadingService.hide();
  }

  private initForm(): void {
    this.changeEmailForm = this.formBuilder.group({
      newEmailAddress: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      confirmPassword: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

}
