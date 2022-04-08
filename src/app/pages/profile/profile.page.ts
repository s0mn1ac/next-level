import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { FileUpload } from 'src/app/shared/models/file-upload.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  public user$: Subscription;

  public userStructure: UserStructure;

  public breakpoints: number[] = [0, 0.3];
  public initialBreakpoint = 0.3;

  private loading: HTMLIonLoadingElement;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private translocoService: TranslocoService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.setInitialData();
    this.initUserSubscription();
    this.initLoadingScreen();
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();
  }

  public onClickLogOutButton(logOutModal: IonModal): void {
    logOutModal.dismiss();
    this.authService.signOut();
  }

  public selectFile(event): void {
    const selectedFiles: FileList = event.target.files;
    this.updateUserProfilePicture(selectedFiles.item(0));
  }

  private setInitialData(): void {
    const userStructure: UserStructure = JSON.parse(localStorage.getItem('next-level-user'));
    this.setUserStructure(userStructure);
  }

  private setUserStructure(userStructure: UserStructure): void {
    if (userStructure != null) {
      this.userStructure = userStructure;
    }
  }

  private initUserSubscription(): void {
    this.user$ = this.userService.userObservable?.subscribe((value: UserStructure) => this.setUserStructure(value));
  }

  private async initLoadingScreen(): Promise<void> {
    this.loading = await this.loadingController.create({
      message: this.translocoService.translate('loadingScreens.uploadingUserProfilePicture'),
      mode: 'ios'
    });
  }

  private updateUserProfilePicture(file: File): void {
    this.loading.present();
    const fileExtension: string = file.name.split('.').pop();
    const renamedFile: File = new File([file], `${this.userStructure.uid}.${fileExtension}`, { type: file.type });
    const currentFileUpload: FileUpload = new FileUpload(renamedFile);
    this.authService.uploadUserProfilePicture(currentFileUpload).subscribe(
      (percentage: number) => {
        console.log('percentage', percentage);
      },
      (error: any) => {
        console.log(error);
        this.loading.dismiss();
      },
      (complete: void) => {
        console.log('FINISH');
        this.loading.dismiss();
      }
    );
  }

}
