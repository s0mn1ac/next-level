import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoleEnum } from 'src/app/shared/enums/role.enum';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { AdministrationService } from 'src/app/shared/services/administration.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-user-administration',
  templateUrl: './user-administration.page.html',
  styleUrls: ['./user-administration.page.scss'],
})
export class UserAdministrationPage implements OnInit, OnDestroy {

  public userAdministrationForm: FormGroup;

  public userStructure: UserStructure;

  public roleSelected: RoleEnum;

  public isDisabled: boolean;

  private params$: Subscription;

  constructor(
    private loadingService: LoadingService,
    private administrationService: AdministrationService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.initParamsSubscription();
  }

  ngOnDestroy(): void {
    this.cancelParamsSubscription();
  }

  public onChangeUserRole(event: any): void {
    this.roleSelected = event?.detail?.value;
  }

  public async onClickModifyUser(): Promise<void> {
    await this.loadingService.show('modifyingUser');
    const displayName: string = this.userAdministrationForm.get('displayName').value;
    await this.administrationService.modifyUser(this.userStructure.uid, displayName, this.roleSelected);
    this.userStructure.displayName = displayName;
    await this.loadingService.hide();
  }

  private initForm(): void {
    this.userAdministrationForm = this.formBuilder.group({
      displayName: new FormControl(null, Validators.compose([Validators.required, Validators.nullValidator, Validators.maxLength(75)])),
      uid: new FormControl({ value: null, disabled: true }, Validators.compose([Validators.required, Validators.nullValidator])),
      email: new FormControl({ value: null, disabled: true }, Validators.compose([Validators.required, Validators.email]))
    });
  }

  private initParamsSubscription(): void {
    this.params$ = this.activatedRoute.params.subscribe((params: Params) => {
      this.setDisabledStatus(params?.id);
      this.loadUser(params?.id);
    });
  }

  private cancelParamsSubscription(): void {
    this.params$?.unsubscribe();
  }

  private setDisabledStatus(uid: string): void {
    const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
    this.isDisabled = userStructure?.uid === uid;
  }

  private async loadUser(uid: string): Promise<void> {
    await this.loadingService.show('loadingUser');

    this.userStructure = await this.administrationService.getUser(uid);

    this.userAdministrationForm.get('displayName').setValue(this.userStructure.displayName);
    this.userAdministrationForm.get('uid').setValue(this.userStructure.uid);
    this.userAdministrationForm.get('email').setValue(this.userStructure.email);

    this.roleSelected = this.userStructure.role;

    if (this.isDisabled) {
      this.userAdministrationForm.get('displayName').disable();
    }

    await this.loadingService.hide();
  }

}
