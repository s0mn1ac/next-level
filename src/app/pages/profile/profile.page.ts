import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { FileUpload } from 'src/app/shared/models/file-upload.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  public userSubscription$: Subscription;

  public user: User;

  public breakpoints: number[] = [0, 0.3];
  public initialBreakpoint = 0.3;

  private loading: HTMLIonLoadingElement;

  constructor(
    private authService: AuthService,
    private translocoService: TranslocoService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.initUserSubscription();
    this.initLoadingScreen();
  }

  ngOnDestroy(): void {
    this.userSubscription$?.unsubscribe();
  }

  public onClickLogOutButton(logOutModal: IonModal): void {
    logOutModal.dismiss();
    this.authService.signOut();
  }

  public selectFile(event): void {
    const selectedFiles: FileList = event.target.files;
    this.updateUserProfilePicture(selectedFiles.item(0));
  }

  private async initLoadingScreen(): Promise<void> {
    this.loading = await this.loadingController.create({
      message: this.translocoService.translate('loadingScreens.uploadingUserProfilePicture'),
      mode: 'ios'
    });
  }

  private initUserSubscription(): void {
    this.userSubscription$ = this.authService.userObservable?.subscribe((user: User) => this.user = user);
  }

  private updateUserProfilePicture(file: File): void {
    this.loading.present();
    const fileExtension: string = file.name.split('.').pop();
    const renamedFile: File = new File([file], `${this.user.uid}.${fileExtension}`, { type: file.type });
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
