import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { NextLevelModalComponent } from 'src/app/components/next-level-modal/next-level-modal.component';
import { NextLevelModalOptions } from 'src/app/shared/interfaces/next-level-modal-options.interface';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { FileUpload } from 'src/app/shared/models/file-upload.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  @ViewChild('nextLevelModal') nextLevelModal: NextLevelModalComponent;

  public user$: Subscription;

  public userStructure: UserStructure;

  public breakpoints: number[] = [0, 0.3];
  public initialBreakpoint = 0.3;

  public logOutModalOptions: NextLevelModalOptions;
  public deleteAccountModalOptions: NextLevelModalOptions;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private translocoService: TranslocoService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.initOptions();
    this.setInitialData();
    this.initUserSubscription();
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();
  }

  public onClickLogOut(): void {
    this.authService.signOut();
  }

  public onClickDeleteAccount(): void {
    this.authService.delete();
  }

  public selectFile(event): void {
    const selectedFiles: FileList = event.target.files;
    this.updateUserProfilePicture(selectedFiles.item(0));
  }

  public onClickShowNextLevelModal(nextLevelModalOptions: NextLevelModalOptions): void {
    this.nextLevelModal.show(nextLevelModalOptions);
  }

  private setInitialData(): void {
    const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
    this.setUserStructure(userStructure);
  }

  private initOptions(): void {

    this.logOutModalOptions = {
      icon: 'trash-outline',
      title: this.translocoService.translate('profile.logOut.logOutHeader'),
      description: this.translocoService.translate('profile.logOut.logOutBody'),
      buttonColor: 'danger',
      buttonName: this.translocoService.translate('buttons.logOut'),
      command: () => this.onClickLogOut()
    };

    this.deleteAccountModalOptions = {
      icon: 'trash-outline',
      title: this.translocoService.translate('profile.deleteAccount.deleteAccountHeader'),
      description: this.translocoService.translate('profile.deleteAccount.deleteAccountBody'),
      buttonColor: 'danger',
      buttonName: this.translocoService.translate('buttons.delete'),
      command: () => this.onClickDeleteAccount()
    };
  }

  private setUserStructure(userStructure: UserStructure): void {
    if (userStructure != null) {
      this.userStructure = userStructure;
    }
  }

  private initUserSubscription(): void {
    this.user$ = this.userService.userObservable?.subscribe((value: UserStructure) => this.setUserStructure(value));
  }

  private async updateUserProfilePicture(file: File): Promise<void> {
    await this.loadingService.show('uploadingUserProfilePicture');
    const fileExtension: string = file.name.split('.').pop();
    const renamedFile: File = new File([file], `${this.userStructure.uid}.${fileExtension}`, { type: file.type });
    const currentFileUpload: FileUpload = new FileUpload(renamedFile);
    await this.authService.uploadUserProfilePicture(currentFileUpload).subscribe(
      async (error: any) => await this.loadingService.hide(),
      async (complete: void) => await this.loadingService.hide());
  }

}
