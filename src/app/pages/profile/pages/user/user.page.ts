import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  public changeUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public async onClickChangeDisplayName(): Promise<void> {
    await this.loadingService.show('updatingName');
    await this.userService.modifyUser('displayName', this.changeUserForm.get('name').value)
      .then(() => this.toastService.throwSuccessToast('displayNameModified'));
    await this.loadingService.hide();
  }

  private initForm(): void {
    const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
    const validators = [Validators.required, Validators.nullValidator, Validators.maxLength(75)];
    this.changeUserForm = this.formBuilder.group({
      name: new FormControl(userStructure?.displayName ?? null, Validators.compose(validators))
    });
  }

}
